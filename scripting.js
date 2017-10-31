var Status;
(function (Status) {
    Status[Status["RUNNING"] = 0] = "RUNNING";
    Status[Status["SUCCESS"] = 1] = "SUCCESS";
    Status[Status["FAILURE"] = 2] = "FAILURE";
})(Status || (Status = {}));
function terminateAndReturn(id, blackboard, status) {
    delete blackboard[id];
    return status;
}
function getActionTick(id) {
    return function (precondition, effect, parameters, ticksRequired) {
        if (parameters === void 0) { parameters = {}; }
        if (ticksRequired === void 0) { ticksRequired = 1; }
        return function (agent, blackboard) {
            parameters.agent = agent;
            parameters.blackboard = blackboard;
            if (precondition(parameters)) {
                if (!blackboard[id]) {
                    blackboard[id] = {};
                    blackboard[id].ticksDone = ticksRequired;
                }
                if (blackboard[id].ticksDone > 0) {
                    blackboard[id].ticksDone--;
                    return Status.RUNNING;
                }
                else {
                    effect(parameters);
                    return terminateAndReturn(id, blackboard, Status.SUCCESS);
                }
            }
            else {
                return Status.FAILURE;
            }
        };
    };
}
function getGuardTick() {
    return function (precondition, parameters, astTick, negate) {
        if (negate === void 0) { negate = false; }
        return function (agent, blackboard) {
            parameters.agent = agent;
            parameters.blackboard = blackboard;
            var proceed = negate ? !precondition(parameters) : precondition;
            return proceed ? execute(astTick, agent, blackboard) : Status.FAILURE;
        };
    };
}
function getSequenceTick(id) {
    return function (astTicks) {
        return function (agent, blackboard) {
            if (!blackboard[id]) {
                blackboard[id] = {};
                blackboard[id].currentIndex = 0;
            }
            while (blackboard[id].currentIndex < astTicks.length) {
                var childStatus = execute(astTicks[blackboard[id].currentIndex], agent, blackboard);
                if (childStatus == Status.RUNNING)
                    return Status.RUNNING;
                else if (childStatus == Status.FAILURE)
                    return terminateAndReturn(id, blackboard, Status.FAILURE);
                else if (childStatus == Status.SUCCESS)
                    blackboard[id].currentIndex += 1;
            }
            return terminateAndReturn(id, blackboard, Status.SUCCESS);
        };
    };
}
function getSelectorTick(id) {
    return function (astTicks) {
        return function (agent, blackboard) {
            if (!blackboard[id]) {
                blackboard[id] = {};
                blackboard[id].currentIndex = 0;
            }
            while (blackboard[id].currentIndex < astTicks.length) {
                var childStatus = execute(astTicks[blackboard[id].currentIndex], agent, blackboard);
                if (childStatus == Status.RUNNING)
                    return Status.RUNNING;
                else if (childStatus == Status.SUCCESS)
                    return terminateAndReturn(id, blackboard, Status.SUCCESS);
                else if (childStatus == Status.FAILURE)
                    blackboard[id].currentIndex += 1;
            }
            return terminateAndReturn(id, blackboard, Status.FAILURE);
        };
    };
}
function execute(astTick, agent, blackboard) {
    return astTick(agent, blackboard);
}
var globalIdCounter = 0;
function action(precondition, effect, params, ticksRequired) {
    return getActionTick(globalIdCounter++)(precondition, effect, params, ticksRequired);
}
function guard(effect, params, astTick) {
    return getGuardTick()(effect, params, astTick);
}
function neg_guard(effect, params, astTick) {
    return getGuardTick()(effect, params, astTick, true);
}
/**
 * Cycles over its children: iterates to the next child on success of a child
 * Succeeds if all succeed, else fails
 * @param {Tick[]} astTicks
 * @returns {Tick}
 */
function sequence(astTicks) {
    return getSequenceTick(globalIdCounter++)(astTicks);
}
/**
 * Cycles over its children: iterates to the next child on failure of a child(think of it as if-else blocks)
 * Succeeds if even one succeeds, else fails
 * @param {Tick[]} astTicks
 * @returns {Tick}
 */
function selector(astTicks) {
    return getSelectorTick(globalIdCounter++)(astTicks);
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
world["status"] = {
    "Player": ["alive"],
    "Stranger": ["alive"],
    "Gate": ["closed"]
};
world["has"] = {
    "Stranger": ["Gas", "Rope"]
};
function goalState() {
    return world["escape"] === ["Player", "Stranger"];
}
var canEat = function (params) {
    return world["at"][params.agent] === world["at"]["Stranger"]
        || world["at"][params.agent] === world["at"]["Player"];
};
var eat = function (params) { return action(canEat, function (params) {
    console.log("Game Over!");
}, params, 0); };
var move = function (params) {
    return action(function (params) {
        var agent = params.agent;
        var currentLocation = world["at"][agent];
        var destination = params.location;
        return currentLocation === destination
            || world["connected"][currentLocation].includes(destination);
    }, function (params) {
        console.log(params.agent + " moves to " + params.location);
        world["at"][params.agent] = params.location;
    }, params);
};
var getIn = function (params) {
    return action(function (params) { return world["at"][params.agent] === world["at"][params.vehicle]; }, function (params) { return world["at"][params.agent] = params.vehicle; }, params, 0);
};
var escape = function (params) {
    return action(function (params) { return world["at"][params.agent] == params.vehicle; }, function (params) { return world["status"][params.agent].push("escaping"); }, params, 0);
};
var jumpOn = function (params) {
    return action(function (params) { return world["at"][params.driver] == params.vehicle
        && world["at"][params.vehicle] == world["at"][params.agent]
        && world["status"][params.driver].includes("escaping"); }, function (params) { return world["at"][params.agent] = params.vehicle; }, params);
};
//zombie tree
var zombieTick = selector([
    neg_guard(canEat, {}, sequence([
        move({ location: "Warehouse" }),
        move({ location: "Entrance" })
    ])),
    eat({})
]);
//player tree
var playerTick = sequence([
    move({ location: "Entrance" }),
    move({ location: "Side" }),
    jumpOn({ driver: "Stranger", vehicle: "Motorcycle" }),
    escape({ vehicle: "Motorcycle" })
]);
//stranger tree
var strangerTick = sequence([
    move({ location: "Side" }),
    getIn({ vehicle: "Motorcycle" }),
    escape({ vehicle: "Motorcycle" })
]);
var playerTickStatus = Status.RUNNING, strangerTickStatus = Status.RUNNING, zombieTickStatus = Status.RUNNING;
function worldTick() {
    if (playerTickStatus != Status.SUCCESS)
        playerTickStatus = execute(playerTick, "Player", blackboard);
    if (strangerTickStatus != Status.SUCCESS)
        strangerTickStatus = execute(strangerTick, "Stranger", blackboard);
    if (zombieTickStatus != Status.SUCCESS)
        zombieTickStatus = execute(zombieTick, "Zombie", blackboard);
}
/*----------- RENDERING -------------------*/
var canvas = document.getElementById('zombie');
var context = canvas.getContext('2d');
var coords = {
    "Back": { x: 800, y: 20 },
    "Warehouse": { x: 800, y: 220 },
    "Entrance": { x: 800, y: 420 },
    "Front": { x: 1000, y: 620 },
    "Side": { x: 300, y: 620 },
    "Motorcycle": { x: 150, y: 820 }
};
canvas.addEventListener("click", this.worldTick.bind(this), false);
function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var map = new Image();
    map.src = "images/zombiemap.png";
    context.drawImage(map, 0, 0, 1185, 825);
    var motorcycle = new Image();
    motorcycle.src = "images/motorcycle.png";
    var mc = coords["Motorcycle"];
    context.drawImage(motorcycle, mc.x, mc.y, 170, 150);
    var stranger = new Image();
    stranger.src = "images/stranger.png";
    var sc = coords[world["at"]["Stranger"]];
    context.drawImage(stranger, sc.x, sc.y, 150, 130);
    var player = new Image();
    player.src = "images/player.png";
    var pc = coords[world["at"]["Player"]];
    context.drawImage(player, pc.x, pc.y, 150, 130);
    var zombie = new Image();
    zombie.src = "images/zombie.png";
    var zc = coords[world["at"]["Zombie"]];
    context.drawImage(zombie, zc.x, zc.y, 150, 130);
}
setInterval(render, 30);
