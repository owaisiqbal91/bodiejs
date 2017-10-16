var Status = {
    RUNNING: 1,
    SUCCESS: 2,
    FAILURE: 3
}

class Node {
    onTerminate() {
    }
}

class Leaf extends Node {
    constructor(procedure) {
        super();
        this.procedure = procedure;
    }
}

class Action extends Leaf {
    tick(visitor, blackboard) {
        return this.procedure.apply(this, [visitor, blackboard]);
    }
}

class Condition extends Leaf {
    constructor(procedure, invert) {
        super(procedure);
        this.invert = invert;
    }

    tick(visitor, blackboard) {
        var status = this.procedure.apply(this, [visitor, blackboard]);
        if (this.invert) {
            if (status === Status.SUCCESS) return Status.FAILURE;
            else if (status === Status.FAILURE) return Status.SUCCESS;
        }
        return status;
    }
}

class Composite extends Node {
    constructor(children) {
        super();
        this.children = children;
        this.currentChildIndex = 0;
    }
}

class Sequence extends Composite {
    tick(visitor, blackboard) {
        while (true) {
            var status = this.children[this.currentChildIndex].tick(visitor, blackboard);

            if (status !== Status.SUCCESS) {
                return status;
            }

            if (this.currentChildIndex === this.children.length - 1) {//SUCCESS and last child
                return Status.SUCCESS;
            }

            //else iterate
            this.currentChildIndex++;
        }
    }
}

class Selector extends Composite {
    tick(visitor, blackboard) {
        while (true) {
            var status = this.children[this.currentChildIndex].tick(visitor, blackboard);

            if (status !== Status.FAILURE) {
                return status;
            }

            if (this.currentChildIndex === this.children.length - 1) {//FAILURE and last child
                return Status.FAILURE;
            }

            //else iterate
            this.currentChildIndex++;
        }
    }
}

class BehaviorTree {
    constructor(rootNode, visitor) {
        this.rootNode = rootNode;
        this.visitor = visitor;
    }

    tick() {
        this.rootNode.tick(this.visitor);
    }
}

/* Register actions/conditions */
actionProceduresMap = {};
conditionProceduresMap = {};

function registerProcedures(procedures, proceduresMap) {
    procedures.forEach(function (procedure) {
        proceduresMap[procedure.name] = procedure;
    })
}

/* Sample Procedures */
function speak(visitor) {
    console.log("Hello! " + visitor);
    return Status.SUCCESS;
}

function canSpeak() {
    return Status.SUCCESS;
}

registerProcedures([speak], actionProceduresMap);
registerProcedures([canSpeak], conditionProceduresMap);

/* Test code */
var node1 = new Action(speak);
var node2 = new Condition(canSpeak);
var seqNode = new Sequence([node2, node1]);

/* Input */
var input = {
    sequence: [
        {
            selector:
                [
                    "canSpeak", "speak"
                ]
        },
        "canSpeak",
        "speak"
        //"not canSpeak", "speak"
    ]
}

var rootNode = parse(input, actionProceduresMap, conditionProceduresMap);
var bt = new BehaviorTree(rootNode, "John");
bt.tick();

/* Compiler */
function parse(obj, actionProceduresMap, conditionProceduresMap) {

    if (typeof obj === "string") {
        if (actionProceduresMap[obj]) { //if it is an action
            return new Action(actionProceduresMap[obj]);
        } else if (conditionProceduresMap[obj]) { //else if it is a condition
            return new Condition(conditionProceduresMap[obj]);
        } else {
            var terms = obj.split(" ");
            if (terms[0] === "not" && conditionProceduresMap[terms[1]]) {// else if it is an inverse condition
                return new Condition(conditionProceduresMap[terms[1]], true);
            }
        }
    } else if (typeof obj === "object") {
        var keys = Object.keys(obj);
        if (keys.length !== 1) {
            throw "Objects can only have one key/value pair"
        } else {
            var key = keys[0];
            var value = obj[key];//has to have one key, as checked above
            if (!Array.isArray(value)) throw "Value in object must be an array"
            if (key === "sequence") {
                return new Sequence(getChildren(value));
            } else if (key === "selector") {
                return new Selector(getChildren(value))
            }
        }
    }

    function getChildren(arr) {
        var childrenArray = [];
        for (var i = 0; i < arr.length; i++) {
            var node = parse(arr[i], actionProceduresMap, conditionProceduresMap)
            childrenArray.push(node);
        }
        return childrenArray;
    }
}

/* Virtual Machine */