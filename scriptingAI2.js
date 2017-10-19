var debug = false;

var Status = {
    RUNNING: 1,
    SUCCESS: 2,
    FAILURE: 3
};

function getStatus(boolVal) {
    if (boolVal) return Status.SUCCESS;
    else return Status.FAILURE;
}

function terminateAndReturn(id, status) {
    delete blackboard[id];
    return status;
}

function getAction(id) {
    return function getActionTick(procedure, ticksRequired = 1) {
        return function tick(blackboard) { if(debug) console.log("In Action: "+procedure.name);
            if (!blackboard[id]) {
                blackboard[id] = {};
                blackboard[id].startTick = blackboard.currentWorldTick;
            }

            if (blackboard.currentWorldTick - blackboard[id].startTick < ticksRequired) {
                return Status.RUNNING;
            } else {
                var boolVal = procedure(blackboard);
                return terminateAndReturn(id, Status.SUCCESS/*getStatus(boolVal)*/);
            }
        }
    };
}

function getGuardTick(procedure, astTick, negate) {
    return function tick(blackboard) { if(debug) console.log("In Guard: "+procedure.name);
        var boolVal = procedure(blackboard);
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
        return function tick(blackboard) { if(debug) console.log("In Sequence");
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
        return function tick(blackboard) { if(debug) console.log("In Selector");
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

function action(procedure, ticksRequired) {
    return getAction(globalIdCounter++)(procedure, ticksRequired);
}

function guard(procedure, astTick){
    return getGuardTick(procedure, astTick);
}

function neg_guard(procedure, astTick) {
    return getGuardTick(procedure, astTick, true);
}

function sequence(astTicks) {
    return getSequence(globalIdCounter++)(astTicks);
}

function selector(astTicks) {
    return getSelector(globalIdCounter++)(astTicks);
}

function write(valuesMap, astTick) {
    return function tick(blackboard) { if(debug) console.log("In write");
        for(var key in valuesMap){
            blackboard[key] = valuesMap[key];
        }
        return execute(astTick, blackboard);
    }
}

/*--------- CUSTOM -----------*/
/*function canSpeak(blackboard) {
    return true;
}

function wantsToSpeak(blackboard) {
    return true;
}

function speak(blackboard) {
    console.log("Hello " + blackboard.name);
    return true;
}

var a1Tick = action(speak);
var gTick = guard(canSpeak, a1Tick);
var rootNodeTick = selector([guard(wantsToSpeak, gTick), action(speak)]);
var blackboard = {name: "Owais", currentWorldTick: 1};
console.log(execute(rootNodeTick, blackboard));*/

/*----------- ZOMBIE ESCAPE!!! -------------------*/

var world = {};
var blackboard = {};
//initial state
world["connected"] = {
    "Back" : ["Warehouse"],
    "Warehouse" : ["Back", "Entrance"],
    "Entrance" : ["Warehouse", "Side", "Front"],
    "Side" : ["Entrance"],
    "Front" : ["Entrance"]
};

world["at"] = {
    "Player" : "Warehouse",
    "Stranger" : "Entrance",
    "Zombie" : "Back",
    "Motorcycle" : "Side",
    "Car" : "Front",
    "Gate" : "Front",
    "Brick" : "Car"
};

world["is"] = {
    "Player" : "alive",
    "Stranger" : "alive",
    "Gate" : "closed"
};

world["has"] = {
    "Stranger" : ["Gas", "Rope"]
};

function goalState(){
    return world["escape"] === ["Player", "Stranger"];
}

//move(Player, Warehouse, Entrance)
function canMove(blackboard){
    return world["at"][blackboard.agent] === blackboard.fromLocation
    && world["connected"][blackboard.fromLocation].includes(blackboard.toLocation);
}
function moveTo(blackboard){
    console.log(blackboard.agent+" moves to "+blackboard.toLocation);
    world["at"][blackboard.agent] = blackboard.toLocation;
}
function canEat(blackboard){
    return world["at"][blackboard.agent] === world["at"]["Stranger"]
    || world["at"][blackboard.agent] === world["at"]["Player"]
}
function eat(blackboard) {
    console.log("Game Over!")
}

//zombie tree
var zombieTick = selector([
    neg_guard(canEat,
        sequence([
            write({fromLocation: "Back", toLocation: "Warehouse"},
            guard(canMove, action(moveTo))),
            write({fromLocation: "Warehouse", toLocation: "Entrance"},
            guard(canMove, action(moveTo)))
        ])
    ),
    guard(canEat,
        action(eat, 0)
    )
]);

//player tree
var playerTick = sequence([
    write({fromLocation: "Warehouse", toLocation: "Entrance"},
    guard(canMove, action(moveTo))),
    write({fromLocation: "Entrance", toLocation: "Front"},
    guard(canMove, action(moveTo)))
]);

//stranger tree
var strangerTick = sequence([
    write({fromLocation: "Entrance", toLocation: "Side"},
        guard(canMove, action(moveTo)))
]);

blackboard.currentWorldTick = 0;
function worldTick(){
    blackboard.currentWorldTick += 1;

    console.log("Current world tick: "+blackboard.currentWorldTick);
    blackboard.agent = "Player";
    execute(playerTick, blackboard);
    blackboard.agent = "Stranger";
    execute(strangerTick, blackboard);
    blackboard.agent = "Zombie";
    execute(zombieTick, blackboard);
}

/*for(var i=0; i<6; i++){
    worldTick();
}*/

var canvas = document.getElementById('zombie');
var context = canvas.getContext('2d');
var coords = {
    "Back": {x: 800, y: 20},
    "Warehouse" : {x: 800, y: 220},
    "Entrance": {x: 800, y: 420},
    "Front" : {x: 1000, y: 620},
    "Side" : {x: 300, y: 620}
}

canvas.addEventListener("click", this.worldTick.bind(this), false);
function render(){
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