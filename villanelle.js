/** Data structure, can change this later **/
var model = {};

/** Initialization of data structure**/
function createAgents(agents) {
    for (var i = 0; i < agents.length; i++) {
        model[agents[i]] = {};
        model[agents[i]]["items"] = new Set();
        model[agents[i]]["location"] = undefined;
        model[agents[i]]["attributes"] = new Set();
        model[agents[i]]["knowledge"] = {};
    }
}

function createItems(items) {
    for (var i = 0; i < items.length; i++) {
        model[items[i]] = {};
        model[items[i]]["agent"] = undefined;
        model[items[i]]["location"] = undefined;
        model[items[i]]["attributes"] = new Set();
    }
}

function createLocations(locations) {
    for (var i = 0; i < locations.length; i++) {
        model[locations[i]] = {};
        model[locations[i]]["agents"] = new Set();
        model[locations[i]]["items"] = new Set();
        model[locations[i]]["attributes"] = new Set();
    }
}

/** Primitives actions for changing the world model**/
function giveTo(agent, item) {
    model[agent]["items"].add(item);
    model[item]["agent"] = agent;
}

function takeFromAgent(agent, item) {
    if (model[item]["agent"] == agent) {
        model[agent]["items"].delete(item);
        model[item]["agent"] = undefined;
    }
}

function goToLocation(agent, location) {
    model[agent]["location"] = location;
    model[location]["agents"].add(agent);
}

function removeAgentFromLocation(agent, location) {
    if (model[agent]["location"] == location) {
        model[agent]["location"] = undefined;
        model[location]["agents"].delete(agent);
    }
}

function placeAtLocation(item, location) {
    model[item]["location"] = location;
    model[location]["items"].add(item);
}

function removeItemFromLocation(item, location) {
    if (model[item]["location"] = location) {
        model[item]["location"] = undefined;
        model[location]["items"].delete(item);
    }
}

function addKnowledge(agent, knowledge) {
    //TODO
}

function removeKnowledge(agent, knowledge) {
    //TODO
}

function setAttributes(entity, attributes) {
    for (var i = 0; i < attributes.length; i++) {
        model[entity]["attributes"].add(attributes[i]);
    }
}

//Actions
//parameters/preconditions/effects
function createNewAction(condition, apply) {
    var action = new Action();
    action.condition = condition;
    action.apply = apply;
    return action;
}

class Action {
}
model["actions"] = {};

function giveAction(agent, action) {
    model["actions"][agent] = action;
}

//Example
createAgents(["Sheriff"]);
createItems(["Gun", "Amulet", "Chest"]);
createLocations(["Town Hall", "Jail"]);
goToLocation("Sheriff", "Town Hall");
giveTo("Sheriff", "Gun");
placeAtLocation("Chest", "Jail");
console.log(model);

openCondition = function(agent) {
    return agent == "Sheriff" && model[agent]["location"] == "Town Hall";
}
openApply = function(agent, item) {
    console.log(agent + " opens " + item);
}

var openAction = createNewAction(openCondition, openApply);

giveAction("Sheriff", openAction);