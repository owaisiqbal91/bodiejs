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
        return function tick(blackboard) {
            if (!blackboard[id]) {
                blackboard[id] = {};
                blackboard[id].startTick = blackboard.currentWorldTick;
            }

            if (blackboard.currentWorldTick - blackboard[id].startTick < ticksRequired) {
                return Status.RUNNING;
            } else {
                var boolVal = procedure(blackboard);
                return terminateAndReturn(id, getStatus(boolVal));
            }
        }
    };
}

function getGuardTick(procedure, astTick, negate) {
    return function tick(blackboard) {
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
        return function tick(blackboard) {
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

var a1Tick = action(speak, 1);
var gTick = guard(canSpeak, a1Tick);
var rootNodeTick = selector([neg_guard(wantsToSpeak, gTick), action(speak)]);
var blackboard = {name: "Owais", currentWorldTick: 1};
//console.log(execute(rootNodeTick, blackboard));