var Status = {
    RUNNING: 1,
    SUCCESS: 2,
    FAILURE: 3
};
function getStatus(boolVal){
    if(boolVal) return Status.SUCCESS;
    else return Status.FAILURE;
}
function terminateAndReturn(id, status){
    delete blackboard[id];
    return status;
}

function getAction(id){
    return function getActionTick(procedure, ticksRequired = 1) {
        return function tick(blackboard) {
            if(!blackboard[id]){
                blackboard[id] = {};
                blackboard[id].startTick = blackboard.currentWorldTick;
            }

            if(blackboard.currentWorldTick - blackboard[id].startTick < ticksRequired){
                return Status.RUNNING;
            }else{
                var boolVal = procedure(blackboard);
                return terminateAndReturn(id, getStatus(boolVal));
            }
        }
    };
}

function guard(procedure, astTick) {
    return function tick(blackboard) {
        if (procedure(blackboard)) {
            return execute(astTick, blackboard);
        } else {
            return Status.FAILURE;
        }
    }
}

function getSequence(id){
    return function getSequenceTick(astTicks) {
        return function tick(blackboard) {
            if(!blackboard[id]) {
                blackboard[id] = {};
                blackboard[id].currentIndex = 0;
            }

            while (blackboard[id].currentIndex < astTicks.length) {
                var childStatus = execute(astTicks[currentIndex], blackboard);

                if(childStatus == Status.RUNNING)
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

function execute(astTick, blackboard) {
    return astTick(blackboard);
}

var globalIdCounter = 0;
function action(procedure, ticksRequired) {
    return getAction(globalIdCounter++)(procedure, ticksRequired);
}
function sequence(astTicks) {
    return getSequence(globalIdCounter++)(astTicks);
}

/*--------- CUSTOM -----------*/
function canSpeak(blackboard) {
    return true;
}

function wantsToSpeak(blackboard) {
    return true;
}

function speak(blackboard) {
    console.log("Hello " + blackboard.name);
    return true;
}

var a1Tick = action(speak, 0);
//var gTick = guard(canSpeak, a1Tick);
//var rootNodeTick = sequence([guard(wantsToSpeak, gTick), action(speak)]);
var blackboard = {name: "Owais", currentWorldTick: 1};
console.log(execute(a1Tick, blackboard));