enum Status {
    RUNNING,
    SUCCESS,
    FAILURE
}

function terminateAndReturn(id: number, blackboard: any, status: Status) {
    delete blackboard[id];
    return status;
}

type Effect = (params: any) => void
type Precondition = (params: any) => boolean
type Tick = (agent: string, blackboard: any) => Status
type ActionTick = (precondition: Precondition, effect: Effect, parameters?: any, ticksRequired?: number) => Tick
/**
 * The guard tick is to add a precondition to the composite ticks
 */
type GuardTick = (precondition: Precondition, parameters: any, astTick: Tick, negate?: boolean) => Tick
/**
 * Sequence/Selector
 */
type CompositeTick = (astTicks: Tick[]) => Tick

function getActionTick(id: number): ActionTick {
    return (precondition, effect, parameters = {}, ticksRequired = 1) => {
        return (agent, blackboard) => {
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
                } else {
                    effect(parameters);
                    return terminateAndReturn(id, blackboard, Status.SUCCESS);
                }
            } else {
                return Status.FAILURE;
            }
        }
    }
}

function getGuardTick(): GuardTick {
    return (precondition, parameters, astTick, negate=false) => {
        return (agent, blackboard) => {
            parameters.agent = agent;
            parameters.blackboard = blackboard;
            let proceed = negate ? !precondition(parameters) : precondition;
            return proceed ? execute(astTick, agent, blackboard) : Status.FAILURE;
        }
    }
}

function getSequenceTick(id: number): CompositeTick {
    return (astTicks) => {
        return (agent, blackboard) => {
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
        }
    }
}

function getSelectorTick(id:number): CompositeTick {
    return (astTicks) => {
        return (agent, blackboard) => {
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
        }
    }
}

function execute(astTick: Tick, agent: string, blackboard: any): Status {
    return astTick(agent, blackboard);
}

var globalIdCounter = 0;

function action(precondition:Precondition, effect:Effect, params?:any, ticksRequired?:number) {
    return getActionTick(globalIdCounter++)(precondition, effect, params, ticksRequired)
}

function guard(effect:Precondition, params:any, astTick:Tick) {
    return getGuardTick()(effect, params, astTick);
}

function neg_guard(effect:Precondition, params:any, astTick:Tick) {
    return getGuardTick()(effect, params, astTick, true);
}

/**
 * Cycles over its children: iterates to the next child on success of a child
 * Succeeds if all succeed, else fails
 * @param {Tick[]} astTicks
 * @returns {Tick}
 */
function sequence(astTicks:Tick[]) {
    return getSequenceTick(globalIdCounter++)(astTicks);
}

/**
 * Cycles over its children: iterates to the next child on failure of a child(think of it as if-else blocks)
 * Succeeds if even one succeeds, else fails
 * @param {Tick[]} astTicks
 * @returns {Tick}
 */
function selector(astTicks:Tick[]) {
    return getSelectorTick(globalIdCounter++)(astTicks);
}

/*----------- ZOMBIE ESCAPE!!! -------------------*/
var world = {};
var blackboard :any= {};
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

var canMove:Precondition = (params) => {
    var agent = params.agent;
    var currentLocation = world["at"][agent];
    var destination = params.location;
    var result:boolean =  currentLocation === destination
        || world["connected"][currentLocation].includes(destination);
    return result;
};
var move:Effect = (params) => {
    console.log(params.agent + " moves to " + params.location);
    world["at"][params.agent] = params.location;
}
var canEat:Precondition = (params) => {
    return world["at"][params.agent] === world["at"]["Stranger"]
        || world["at"][params.agent] === world["at"]["Player"]
}
var eat:Effect = (params) => {
    console.log("Game Over!")
}

//zombie tree
let zombieTick = selector([
    neg_guard(canEat, {},
        sequence([
            action(canMove, move, {location: "Warehouse"}),
            action(canMove, move, {location: "Entrance"})
        ])
    ),
    action(canEat, eat, {}, 0)
]);

//player tree
let playerTick = sequence([
    action(canMove, move, {location: "Entrance"}),
    action(canMove, move, {location: "Front"})
]);

//stranger tree
let strangerTick = sequence([
    action(canMove, move, {location: "Side"})
]);


function worldTick() {
    execute(playerTick, "Player", blackboard);
    execute(strangerTick, "Stranger", blackboard);
    execute(zombieTick, "Zombie", blackboard);
}

var canvas = <HTMLCanvasElement> document.getElementById('zombie');
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
    context.clearRect(0, 0, canvas.width, canvas.height);
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