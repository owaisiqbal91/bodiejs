var debug = false;

var Status = {
    RUNNING: 1,
    SUCCESS: 2,
    FAILURE: 3
};

function terminateAndReturn(id, status) {
    delete blackboard[id];
    return status;
}

function getAction(id) {
    return function getActionTick(precondition, procedure, parameters={}, ticksRequired = 1) {
        return function tick(blackboard) {
            parameters.blackboard = blackboard;
            if (precondition(parameters)) {
                if (!blackboard[id]) {
                    blackboard[id] = {};
                    blackboard[id].startTick = blackboard.currentWorldTick;
                }

                if (blackboard.currentWorldTick - blackboard[id].startTick < ticksRequired) {
                    return Status.RUNNING;
                } else {
                    procedure(parameters);
                    return terminateAndReturn(id, Status.SUCCESS);
                }
            } else {
                return Status.FAILURE;
            }
        }
    }
}

function getGuardTick(procedure, parameters, astTick, negate) {
    return function tick(blackboard) {
        if (debug) console.log("In Guard: " + procedure.name);
        parameters.blackboard = blackboard;
        var boolVal = procedure(parameters);
        if (negate)
            boolVal = !boolVal;
        if (boolVal) {
            return execute(astTick, blackboard);
        } else {
            return Status.FAILURE;
        }
    }
}

function getSequence(id) {
    return function getSequenceTick(astTicks) {
        return function tick(blackboard) {
            if (debug) console.log("In Sequence");
            if (!blackboard[id]) {
                blackboard[id] = {};
                blackboard[id].currentIndex = 0;
            }

            while (blackboard[id].currentIndex < astTicks.length) {
                var childStatus = execute(astTicks[blackboard[id].currentIndex], blackboard);

                if (childStatus == Status.RUNNING)
                    return Status.RUNNING;
                else if (childStatus == Status.FAILURE)
                    return terminateAndReturn(id, Status.FAILURE);
                else if (childStatus == Status.SUCCESS)
                    blackboard[id].currentIndex += 1;
            }
            return terminateAndReturn(id, Status.SUCCESS);
        }
    }
}

function getSelector(id) {
    return function getSelectorTick(astTicks) {
        return function tick(blackboard) {
            if (debug) console.log("In Selector");
            if (!blackboard[id]) {
                blackboard[id] = {};
                blackboard[id].currentIndex = 0;
            }

            while (blackboard[id].currentIndex < astTicks.length) {
                var childStatus = execute(astTicks[blackboard[id].currentIndex], blackboard);

                if (childStatus == Status.RUNNING)
                    return Status.RUNNING;
                else if (childStatus == Status.SUCCESS)
                    return terminateAndReturn(id, Status.SUCCESS);
                else if (childStatus == Status.FAILURE)
                    blackboard[id].currentIndex += 1;
            }
            return terminateAndReturn(id, Status.FAILURE);
        }
    }
}

function execute(astTick, blackboard) {
    return astTick(blackboard);
}

var globalIdCounter = 0;

function action(precondition, procedure, params, ticksRequired) {
    return getAction(globalIdCounter++)(precondition, procedure, params, ticksRequired)
}

function guard(procedure, parameters, astTick) {
    return getGuardTick(procedure, parameters, astTick);
}

function neg_guard(procedure, parameters, astTick) {
    return getGuardTick(procedure, parameters, astTick, true);
}

function sequence(astTicks) {
    return getSequence(globalIdCounter++)(astTicks);
}

function selector(astTicks) {
    return getSelector(globalIdCounter++)(astTicks);
}

/*----------- ZOMBIE ESCAPE!!! -------------------*/

var world = {};
var blackboard = {};
//initial state
world["connected"] = {
    "Back": ["Warehouse"],
    "Warehouse": ["Back", "Entrance"],
    "Entrance": ["Warehouse", "Side", "Front"],
    "Side": ["Entrance"],
    "Front": ["Entrance"]
};

world["at"] = {
    "Player": "Warehouse",
    "Stranger": "Entrance",
    "Zombie": "Back",
    "Motorcycle": "Side",
    "Car": "Front",
    "Gate": "Front",
    "Brick": "Car"
};

world["is"] = {
    "Player": "alive",
    "Stranger": "alive",
    "Gate": "closed"
};

world["has"] = {
    "Stranger": ["Gas", "Rope"]
};

function goalState() {
    return world["escape"] === ["Player", "Stranger"];
}

function canMove(params) {
    var agent = params.blackboard.agent;
    var currentLocation = world["at"][agent];
    var destination = params.location;
    return currentLocation === destination
        || world["connected"][currentLocation].includes(destination);
}
function moveTo(params) {
    console.log(params.blackboard.agent + " moves to " + params.location);
    world["at"][params.blackboard.agent] = params.location;
}
function canEat(params) {
    return world["at"][params.blackboard.agent] === world["at"]["Stranger"]
        || world["at"][params.blackboard.agent] === world["at"]["Player"]
}
function eat(params) {
    console.log("Game Over!")
}


//zombie tree
var zombieTick = selector([
    neg_guard(canEat, {},
        sequence([
            action(canMove, moveTo, {location: "Warehouse"}),
            action(canMove, moveTo, {location: "Entrance"})
        ])
    ),
    guard(canEat, {},
        action(eat, 0)
    )
]);

//player tree
var playerTick = sequence([
        action(canMove, moveTo, {location: "Entrance"}),
        action(canMove, moveTo, {location: "Front"})
    ]);

//stranger tree
var strangerTick = sequence([
    action(canMove, moveTo, {location: "Side"})
]);

blackboard.currentWorldTick = 0;

function worldTick() {
    blackboard.currentWorldTick += 1;

    console.log("Current world tick: " + blackboard.currentWorldTick);
    blackboard.agent = "Player";
    console.log(execute(playerTick, blackboard));
    blackboard.agent = "Stranger";
    execute(strangerTick, blackboard);
    blackboard.agent = "Zombie";
    execute(zombieTick, blackboard);
}


var canvas = document.getElementById('zombie');
var context = canvas.getContext('2d');
var coords = {
    "Back": {x: 800, y: 20},
    "Warehouse": {x: 800, y: 220},
    "Entrance": {x: 800, y: 420},
    "Front": {x: 1000, y: 620},
    "Side": {x: 300, y: 620}
}

canvas.addEventListener("click", this.worldTick.bind(this), false);

function render() {
    context.width = context.width;
    var map = new Image();
    map.src = "images/zombiemap.png";
    context.drawImage(map, 0, 0, 1185, 825);

    var zombie = new Image();
    zombie.src = "images/zombie.png";
    var zc = coords[world["at"]["Zombie"]];
    context.drawImage(zombie, zc.x, zc.y, 171, 160);

    var player = new Image();
    player.src = "images/player.png";
    var pc = coords[world["at"]["Player"]];
    context.drawImage(player, pc.x, pc.y, 171, 160);

    var stranger = new Image();
    stranger.src = "images/stranger.png";
    var sc = coords[world["at"]["Stranger"]];
    context.drawImage(stranger, sc.x, sc.y, 171, 160);
}

setInterval(render, 30);