var locations =
  ["Firehouse", "JS Cain's House", "Jail", "Bank",
    "Bakery", "Chinatown", "Town Hall"]

var characters =
  ["You"]

//to see if i can make js cain a character, not treated as an object
var npcs =
  ["Sheriff Hayes", "JS Cain", "Pat Wesley", "William Hang",
    "Mrs. Perry", "Mr. Perry", "Shotgun Johnny"]
    
// State
var location_of =
  {
    "Sheriff Hayes": "Town Hall",
    "JS Cain": "Start",
    "Pat Wesley": "Bakery",
    "You": "Town Hall",
    "Amulet": "Chinatown",
    "William Hang": "Jail",
    "Insurance Paper": "",
    "Letter": "Wesley House",
    "Mrs. Perry": "Perry House",
    "Shotgun Johnny": "Start",
    "Mr. Perry": "Graveyard",
    "Key": "Sheriff Hayes",
    "Hat": ""
  }

var closed_objects =
  {
    "Water Valve Housing": "Firehouse",
    "Bank Safe": "Bank"
  }

var clothing_on = //for wear function
  {
    "Sheriff Hayes": "",
    "JS Cain": "",
    "Pat Wesley": "",
    "You": ""
  }

var locations_visited = [];

var conversation_log =
  {
    "Firehouse": [],
    "JS Cain's House": [],
    "Jail": [],
    "Bank": [],
    "Bakery": [],
    "Chinatown": [],
    "Town Hall": [],
    "Sheriff Hayes": [],
    "William Hang": [],

  }
//working on var topics to replace holding something for ask/tell
var topics = {"Hat":"unknown", "Insurance Paper":"unknown", "Letter":"unknown", "Firehouse":"unknown", "Perrys":"known", "Amulet":"unknown"};
var knowledge =
  {
    ["William Hang"]: "unknown",  
    ["Firehouse"]: "unknown", 
    ["You"]: "unknown", // should be for key, can model using location_of
    ["Pat Wesley"]: "unknown", 
    ["Letter"]: "unknown", //can model using location_of
    ["Mr. Perry"]: "unknown", 
    ["Shotgun Johnny"]: "unknown", 
    ["Hat"]: "unknown", //can model using location_of
    ["Insurance"]: "unknown", //can model using location_of
    ["Amulet"]: "unknown"
  }

var hang_knowledge =  
[ 
  {
    topic: "Firehouse",
    quips: 
    [
      { 
      content: "<q>That night, I slipped out of the bakery around 1 AM. Work was especially brutal " +
				"and I needed some relief. I went to the saloon and drank myself silly, when I heard " +
				"a commotion outside. I stumbled out and saw the fire ripping through the town. I " +
				"could see the homes of my people burning on the hill.</q> He chokes on these words, " +
				"and you see sorrow in his eyes. <q>I ran into the night. Only this morning did I " +
				"have the guts to investigate. My family was gone, my home torched. I didn't even " +
				"bother looking inside. That's when the sheriff and his men grabbed me, and threw me " +
				"in here. On my way to the bar Ipassed the firehouse, and heard a voice muttering " +
				"to itself, 'the prop's to break the line'. I think I know who it was, but he's a " +
				"dangerous man. I think he saw me that night and I'm sure he'll come for revenge " +
				"if he knows I sent you. Good luck, friend.</q>",
      id: "firehouse_tampering",	  
      people_told: []
      }
    ]
  },
  {
    topic: "Amulet",
    quips :
    [
      {
        content: "I lost an amulet last night.",
        id: "amulet_hangs",
        people_told: []
      }
    ]

  }
]

var you_knowledge = 
[
  {
    topic:  "Amulet",
    quips :
    [
      {
        content: "I found an amulet at the firehouse",
        id: "you_amulet",
        people_told: []
      }
    ]
  },
  {
    topic:  "Perrys",
    quips :
    [
      {
        content: "I am looking for the Perry's",
        id: "you_Perrys",
        people_told: []
      }
    ]
  }
]

var cain_knowledge = [];

var wesley_knowledge = 
[
  {
    topic:  "Perrys",
    quips :
    [
      {//when this content is accessed, ->  locations.push("Perry House"); locations.push("Wesley House");
        content:// "You ask Pat Wesley to give you some information about the Perrys.</br></br>" +
                 "<q>They're in mourning " +
                 "for their lost property, I suspect.</q></br ></br > Before you can get " +
                 "in a word, he prattles on, </br ></br ><q>Yes, I represent them and " +
                 "their businesses. I am here to... look for any sign of " +
                 "foul play, and to reclaim any found valuables for the Perry " +
                 "estate. A kind and noble pair they are. If you seek them, " +
                 "check their home on Main Street, but I warn you, they're " +
                 "likely to be in a sad state indeed.</q></br ></br >" +
                 "<b>You now have access to the Perry and Wesley House</b>",
        id: "you_Perrys",
        people_told: [],
        //effect: locations.push("Perry House") locations.push("Wesley House")
      }
    ]
  }
]
var hayes_knowledge = 
[
  {
    topic:  "Firehouse",
    quips :
    [
      {
        content: //"You ask the Sheriff to unlock the firehouse.</br></br > " +
                 //"The Sheriff responds, <q>" +
                 "<q>Sorry kid, the firehouse is gonna stay locked up " +
                 "tight unless you have a good reason to search it, " +
                 "at the firefighters request.</q>",
        id: "hayes_lock",
        people_told: []
      },
      {
        content:  //"</br > You tell the sheriff what Hang told you about " +
                  //"the firehouse, and he grimaces.</br ></br >" +
                  //"He grimaces.</br ></br > Sheriff Hayes says, <q>I wish he had just told us his story. " +
                  "<q>I wish he had just told us his story. I can't release him yet, but you should hunt down that lead. " +
                  "Here's the key.</q></br ></br >You pocket it.",
        id: "hayes_lock2",
        people_told: []
        //conditions: ((knowledge["William Hang"] == "given") && (knowledge["Firehouse"] == "known"))
      }
    ]
  }
]

var mr_perry_knowledge = 
[
  {
    topic:  "Letter",
    quips :
    [
      {
        content: "You show him the letter.</br></br>He smiles when you show him the " +
                 "letter he sent to Pat Wesley. </br></br><q>Well, you're " +
                 "quite the investigator, aren't you? Unfortunately, " +
                 "that's not going to hold up in court. It's speculative, illegally " +
                 "obtained, and with Wesley on my side no court will indict me on such " +
                 "evidence. Besides. This is a place of constant change. Fires occur " +
                 "naturally, after all - they destroy the dead wood.</q></br></br> He turns away " +
                 "from you.",
        id: "mr_perry_letter",
        people_told: []
      }
    ]
  }
]
var mrs_perry_knowledge = 
[
  {
    topic:  "Insurance Paper",
    quips :
    [
      {
        content: //"You pull out the document that Cain gave you and hand it to her. " +
                 //"Mrs. Perry is unimpressed.</br></br><q>
                 "Well? Why show me what I already " +
                 "know? JS Cain likely told you I was up to no good, eh? He's " +
                 "hated us for years.</q>",
        id: "mrs_perry_insurance",
        people_told: []
      }
    ]
  }
]
var sj_knowledge = 
[
  {
    topic:  "Hat",
    quips :
    [
      {
        content: //"You show him the hat you found in the firehouse.</br></br><q>Yeah, " +
                 "Yeah, that's me hat...</q></br></br>Johnny blinks.</br></br><q>Where'd you find " +
                 "that? I have another but that's my favorite. I got a prop " +
                 "for ya - give it back? Please?</q></br></br>He realizes that he's " +
                 "been made. <q></br></br>Damn. Alright, fine. I was there that night, " +
                 "but you can't pin the arson on me. There's no way I could " +
                 "have set the fire and sabotaged the water main at once. Now, " +
                 "can I at least have my hat back?</q></br></br>You refuse to give him " +
                 "the evidence.",
        id: "sj_hat",
        people_told: []
      }
    ]
  }
]

var character_knowledge = 
[
  {"You": you_knowledge},
  {"William Hang": hang_knowledge},
  {"JS Cain": cain_knowledge},
  {"Pat Wesley": wesley_knowledge},
  {"Sheriff Hayes": hayes_knowledge},
  {"Mr. Perry": mr_perry_knowledge},
  {"Mrs. Perry": mrs_perry_knowledge},
  {"Shotgun Johnny": sj_knowledge}
]

var ending = false;

// lookup_knowledge(c) input: character string, output: knowledge object for specific character
// returns undefined if no knowledge base for character 
function lookup_knowledge(c) {
    if(character_knowledge[c]) {
      return character_knowledge[c];
    }
  console.log("Couldn't find knowledge for character " + c);
  return undefined;
}

//find_quips(c,t) input: c, character string; t, thing string
// output: array of quip objects
//returns undefined no topic for specific character
//assumes knowledge base is declared for every character
function find_quips(c, t) {
    if(character_knowledge[c]) {
      var charknowledge = character_knowledge[c];
      for(var j = 0; j < charknowledge.length; j++) {
        if (charknowledge[j].topic == t) {
          return charknowledge[j].quips;
        }
      }
      //console.log("Couldn't find quips for topic " + t);
    }
  //console.log("Couldn't find knowledge for character " + c);
  return undefined;
}

//check_people_told(c, quip_Array) input: c, character string who you are checking if told, quip_Array is an array of quips from character knowledge
//output: a quip object
//returns undefined if all quips have been said to character c
function check_people_told(c, quip_Array) {
  for(var i = 0; i < quip_Array.length; i++){
    if(quip_Array[i].people_told.length == 0) {
      return quip_Array[i];
    }
    else {
      var told = false;
      for(var j = 0; j < quip_Array[i].people_told.length; j++) {
        if (quip_Array[i].people_told[j] == c){
          told = true;
        }
      }
      if (!told) {
       return quip_Array[i];
      }
    }
  }
  return undefined;
}

var descriptions =
  [{ thing: "William Hang", descr: "The town cook. He was the last person at the scene of the crime." },
  { thing: "Firehouse", descr: "The town's firehouse. A nearby ditch houses a water valve." },
  { thing: "Pat Wesley", descr: "An attorney in Bodie. He represents the Perry's and their businessses." },
  { thing: "Letter", descr: "A letter from Mr. Perry to his attorney detailing a potential new business venture." },
  { thing: "Mr. Perry", descr: "A tall confident, man with an eyepatch on one eye. Mono County Supervisor." },
  { thing: "Shotgun Johnny", descr: "A short man with a thick cornish accent. He seems to favor round black hats." },
  { thing: "Hat", descr: "A hat found near the tampered-with water valve. The initials SJ are stitched inside." },
  { thing: "Insurance", descr: "The insurance document showing a list of losses from the fire, the Perry's lost suspiciously less than everyone else" },
  { thing: "Amulet", descr: "A wooden amulet on a twine string. A faded sketch of a girl is inside." }
  ];

var inventory =
  [{ thing: "Town Hall", descr: "The center of the town of Bodie. The Sheriff is usually here." },
  { thing: "Sheriff Hayes", descr: "The town's Sheriff. You met him when you first arrived. If you need a hint, see him at the Town Hall." },
  ];

var npc_plans =
  {
    "JS Cain":
    [{ op: "go", args: ["JS Cain", "Bank"] },
    { op: "go", args: ["JS Cain", "Town Hall"] },
    { op: "talk", args: ["JS Cain", "Sheriff Hayes"] },
    { op: "go", args: ["JS Cain", "Bank"] },
    { op: "open", args: ["JS Cain", "Bank Safe"] },
    ],
    "Shotgun Johnny":
    [{ op: "go", args: ["Shotgun Johnny", ""] },
    { op: "go", args: ["Shotgun Johnny", "Graveyard"], status: "Offstage" },
    { op: "go", args: ["Shotgun Johnny", "Firehouse"] },
    //examine water valve housing
    { op: "go", args: ["Shotgun Johnny", "Town Hall"] },
    { op: "talk", args: ["Shotgun Johnny", "Sheriff Hayes"], status: "Player Key" },
    { op: "go", args: ["Shotgun Johnny", "Firehouse"] },
    { op: "open", args: ["Shotgun Johnny", "Water Valve Housing"] },
    { op: "take", args: ["Shotgun Johnny", "Hat"] },
    { op: "go", args: ["Shotgun Johnny", "Graveyard"] }
    ]
  };

var current_choices;

//function choiceToString(c) input: a choice object containing an operation and arguments, output: a string describing the action that would be taken
//assumes there are at least one args
function choiceToString(c) {
  var { op, args } = c;
  var str = "";

  switch (op) {
    case "take": {
      return "Take " + args[1];
    }
    case "go": {
      return "Go to " + args[1];
    }
    case "talk": {
      return "Talk to " + args[1];
    }
    case "give": {
      return "Give " + args[2] + " to " + args[1];
    }
    case "wear": {
      return "Wear " + args[1];
    }
    case "ask": {
      return "Ask " + args[1] + " about " + args[2];
    }
    case "tell": {
      return "Tell " + args[1] + " about " + args[2];
    }
    case "examine": {
      return "Examine " + args[1];
    }
    case "open": {
      return "Open " + args[1];
    }
	case "accuse": {
		if (args[2] == ""){
			return "Accuse " + args[1];
		}
		return "Accuse " + args[1] + " and " + args[2];
	}
    default: return op + " " + args[args.length - 1];
  }
}

// displayState() no input or output
// updates html code with current variable states
function displayState() {
  toRender = "";
  state = [];
  
  if (ending){
	document.getElementById("col1").innerHTML = "";
	document.getElementById("col2").innerHTML = "";
	return;
  }
  
  // stuff at all locations
  for (var i = 0; i < locations.length; i++) {
    var stuff = whatsAt(locations[i]);
    toRender += "<b>At " + locations[i] + ":</b>";
    if (stuff.length > 0) {
      toRender += "<p>" + stuff.toString() + "<br>";
    }

    toRender += "</p>";
    
    if (i == Math.ceil(locations.length / 2 - 1)) {
      document.getElementById("col1").innerHTML = toRender;
      toRender = "";
    }
  }

  document.getElementById("col2").innerHTML = toRender;
  
  //document.getElementById("state").innerHTML = toRender;
}

// displayInventory() no input or output
// updates html code with items in player's inventory
function displayInventory() {
  toRender = "Information<br>";
  
  if (ending){
	document.getElementById("information").innerHTML = "";
	return;
  }
  
  for (var i = 0; i < inventory.length; i++) {
    toRender += "<a onclick=describeThing(" + i + ") href=javascript:void(0);>" + inventory[i].thing + "<br>";
  }


  // inventory of knowledge?
  document.getElementById("information").innerHTML = toRender;

  for (var i = 0; i < descriptions.length; i++) {
    if (knowledge[descriptions[i].thing] != "unknown") {
      inventory.push(descriptions[i]);
      descriptions.splice(i, 1);
    }
  }
}

//describeThing(t) input: index of object in inventory to be described
// assumes t is within bounds of inventory
function describeThing(t) {
  var display_text = inventory[t].descr;
  document.getElementById("description").innerHTML = display_text;
  //render();
}

// displayChoices() No input or direct output
// Updates html code with possible choices the player can choose to make right now
function displayChoices() {
  toRenderAction = "";
  toRenderConversation = "";
  if (ending){
	document.getElementById("actions").innerHTML = "";
	document.getElementById("conversation").innerHTML = "";
	return;
  }
  for (var i = 0; i < current_choices.length; i++) {
    var choice = current_choices[i];
    var last_character;
    if (choice.args[0] != last_character) {
      toRenderAction += "<br>" + "Actions for " + choice.args[0] + "<br>";
      toRenderConversation += "<br>" + "Conversation for " + choice.args[0] + "<br>";
    }
    //seperate operators for conversation and action
    if (choice.op == "talk" || choice.op == "ask" || choice.op == "tell"){
      toRenderConversation += "<a onclick=selectChoice(" + i + ") href=javascript:void(0);>" + choiceToString(choice) + "</a><br>";
    }
    else{
      toRenderAction += "<a onclick=selectChoice(" + i + ") href=javascript:void(0);>" + choiceToString(choice) + "</a><br>";
    }
    last_character = choice.args[0];
  }
  document.getElementById("actions").innerHTML = toRenderAction;
  document.getElementById("conversation").innerHTML = toRenderConversation;
}

// render() no input or output
// advances the world by one turn
function render() {
  document.getElementById("description").innerHTML = "";
  advanceNPCs();
  current_choices = generate_choices();
  displayState();
  displayInventory();
  displayChoices();
}

// finalRender() no input or output
// advances the world to the final state
function finalRender() {
	ending = true;
	document.getElementById("description").innerHTML = "";
	displayState();
	displayInventory();
	displayChoices();
}

// advanceNPCs() no input or output
// Has all NPCs perform their next applicable action
function advanceNPCs() {
  for (var p in npc_plans) {
    var plan = npc_plans[p];
    if (plan.length > 0 && cmdToAction(plan[0]).applies) {
      if (plan[0].hasOwnProperty("status")) {
        checkCondition(p, plan);
      }
      else {
        applyOper(plan[0]);
        plan.splice(0, 1);
      }
    }
  }
}

// checkCondition(npc, plan) input: npc, the npc being checked; plan, the next action that will be undertaken
// ooutput: none
function checkCondition(npc, plan) {
  var advance = false;

  switch (npc) {
    case "Shotgun Johnny": {
      if (plan[0].status == "Offstage") {
        advance = locations.indexOf("Graveyard") > -1;
      }
      else if (plan[0].status == "Player Key") {
        advance = knowledge["You"] == "known";
      }
      break;
    }
  }

  if (advance) {
    applyOper(plan[0]);
    plan.splice(0, 1);
  }
}

//selectChoice(index) input: index, the index in the array of current_choices being selected; no output
//assumes index is within bounds of current_choices
//updates html code with response to choice
function selectChoice(index) {
	

  var display_text = applyOper(current_choices[index]);

  document.getElementById("response").innerHTML = display_text;
  
  var cmd = current_choices[index];
  var { op, args } = cmd;

  if (op == "accuse"){
	  finalRender();
  }
  // current_choices = generate_choices();
  render();
}

//cmdToAction(cmd) input: command object with an operation and arguments
//output: text string generated by action, undefined if not acceptable operation
//assumes at least two valid args
function cmdToAction(cmd) {
  var { op, args } = cmd;

  switch (op) {
    case "take": {
      return take(args[0], args[1]);
    }
    case "go": {
      return go(args[0], args[1]);
    }
    case "talk": {
      return talk(args[0], args[1]);
    }
    case "give": {
      return give(args[0], args[1], args[2]);
    }
    case "wear": {
      return wear(args[0], args[1]);
    }
    case "ask": {
      return ask(args[0], args[1], args[2]);
    }
    case "tell": {
      return tell(args[0], args[1], args[2]);
    }
    case "examine": {
      return examine(args[0], args[1]);
    }
    case "open": {
      return open(args[0], args[1]);
    }
	case "accuse": {
		return accuse(args[1], args[2]);
	}
    default: return undefined;
  }
}

// applyOper(cmd) input: command to be sent to cmdToAction
// output: text to be displayed to the player
function applyOper(cmd) {

  var displayText = "Action not defined!"; // to return at the end

  var action = cmdToAction(cmd);

  if (action != undefined) {
    action.text = action.effects(); //call effects and set text
    displayText = action.text;
  }
  return displayText;
}
// whatsAt(loc) input: loc, a location
// output: Array of objects at the location
function whatsAt(loc) {
  var things = [];
  for (var thing in location_of) {
    if (location_of[thing] == loc) {
      things.push(thing);
    }
  }
  return things;
}

// generate_choices() no input
// output: array of command options
function generate_choices() {
  choices = [];
  
  if (knowledge["You"] == "known" && location_of["You"] == location_of["Sheriff Hayes"]) {	  
	choices.push( { op: "accuse", args: ["You", "William Hang", ""] } );	
    if (knowledge["Hat"] == "known") {	
      choices.push( { op: "accuse", args: ["You", "Shotgun Johnny", ""] } ); 
    }
    if (knowledge["Letter"] == "known" && knowledge["Insurance"] == "known"  && knowledge["Hat"] == "known") {	
      choices.push( { op: "accuse", args: ["You", "Shotgun Johnny", "The Perrys"] } ); 
    }
  }
  
  // for each character, see what they can do
  for (var ci in characters) {
    var c = characters[ci];
    var loc = location_of[c];
    var things = whatsAt(loc);
    var things_held = whatsAt(c);

    //things at location of each character
    for (var ti in things) {
      var thing = things[ti];
      //taking it
      if (take(c, thing).applies) {
        choices.push({ op: "take", args: [c, thing] });
      }
      else {
        // talking to it
        if (talk(c, thing).applies) {
          choices.push({ op: "talk", args: [c, thing] });
        }
      }
    } // end loop over things at location of c

    for (var thi in things_held) {
      thing_held = things_held[thi];

      for (var ci2 in npcs) {
        var c2 = npcs[ci2];
        if (give(c, c2, thing_held).applies) {
          choices.push({ op: "give", args: [c, c2, thing_held] });
        }
      }
      
      //examining it
      if (examine(c, thing_held).applies) {
        choices.push({ op: "examine", args: [c, thing_held] });
      }
    }
    
    // opening it
    for (var object in closed_objects) {
      if (open(c, object).applies) {
        choices.push({ op: "open", args: [c, object] });
      }
    }

    // places to move
    for (var li in locations) {
      var l = locations[li];
      //if(l != loc) {
      if (go(c, l).applies) {
        choices.push({ op: "go", args: [c, l] });
      }
    }
    //for (var i = 0; i < lookup_knowledge(c).length; i++) {
    for (var topic in topics) {
      //var topic = lookup_knowledge(c)[i].topic;
      var t = topic;
      for (var ci2 in npcs) {
        var c2 = npcs[ci2];
        if (ask(c, c2, t).applies) {
          choices.push({ op: "ask", args: [c, c2, t] });
        }
        if (tell(c, c2, t).applies) {
          choices.push({ op: "tell", args: [c, c2, t] });
        }
      }
    }
  } //end loop over characters
  return choices;

}

// begin() no input or output
// updates html to display starting text
function begin() {
  document.getElementById("response").innerHTML = "<q>Hey, stranger.</q> </br></br><q>Seems like you've arrived in Bodie at a bad time. I'm sheriff " +
                                                  "Maurice Hayes. Pleased to make your aquantance.</q></br></br>You explain to the sheriff " +
                                                  "that your grandfather owned a general store on Main Street. You visited Bodie once as " +
                                                  "a child, in its heyday, and remembered the town as a lively camp, a place of opportunity. " +
                                                  "You left your life in the city to take over the store after granddad's death, but now " +
                                                  "that the store (and your money) is gone, you're left aimless.</br></br> The sheriff " +
                                                  "scratches his chin and chimes in.</br></br><q>Well, here's an aim for you - we think " +
                                                  "the fire that burned your store, and damn near half of Bodie, was arson. The fire " +
                                                  "started in Mrs. Perry's restaurant, around 2 am. That itself isn't too suspicious, " +
                                                  "but the water lines were also deliberately sabotaged. I also know for a fact that " +
                                                  "there's folk about who stood to benefit from this fire.</q> </br></br> You ask if there are any leads. </br></br><q>Well, " +
                                                  "soon, JS Cain will have a list of those who got insurance from the fire and their " +
                                                  "payouts. We also haven't searched Perry's restaurant for clues yet either. Why, are " +
                                                  "you interested in helping? There'd be a reward in it, and justice, too. I don't know " +
                                                  "who I can trust in town, but as an outsider, there's no way you were involved.</q>" +
                                                  "</br></br>Please help me find the arsonist";
 
  render(); 
}

//ask(agent, npc, topic) input: agent string, npc string, topic string
//output { applies: boolean, effects: () -> string, text: string }
function ask(agent, npc, topic) {
  var applies = (location_of[agent] == location_of[npc]) && (topics[topic] == "known") &&
                (find_quips(npc, topic)!= undefined) && (check_people_told(agent, find_quips(npc, topic)) != undefined);
  var text = agent + " ask about the " + topic + ". </br ></br >" +
             npc + " responds, ";  
  function effects() {
    var quipArray = find_quips(npc, topic);
    var check = check_people_told(agent, quipArray);
    text += check.content;
    check.people_told.push(agent);
  return text;
  }
  return { applies: applies, effects: effects, text: text };
}

//tell(agent, npc, topic) input: agent string, npc string, topic string
//output { applies: boolean, effects: () -> string, text: string }
function tell(agent, npc, topic) {
  var applies = (location_of[agent] == location_of[npc]) && (find_quips(agent, topic)!= undefined) && 
                (check_people_told(npc, find_quips(agent, topic)) != undefined) && (topics[topic] == "known");
  var text = "";
  function effects() { 
        var quip = check_people_told(npc, find_quips(agent, topic));
        text += quip.content; 
        quip.people_told.push(npc);
        if (find_quips(npc, topic) != undefined) {
          find_quips(npc,topic).push({content: quip.content, id: quip.id, people_told: [agent]});
        }
        else {
          lookup_knowledge(npc).push({topic: topic, quips: [{content: quip.content, id: quip.id, people_told: [agent]}]});   
        }
  return text;
  }
return { applies: applies, effects: effects, text: text };
}


//take(agent, thing) input: agent string, thing string
//output { applies: boolean, effects: () -> string, text: string }
function take(agent, thing) {

  var applies = (location_of[agent] == location_of[thing]) && (characters.indexOf(thing) < 0) &&
                (npcs.indexOf(thing) < 0);
  var text = "";

  function effects() {
    location_of[thing] = agent;
    topics[thing] = "known";//allows you to ask/tell about this thing
    var text = agent + " take the " + thing + ".";

    if (thing == "Amulet") {//thing is amulet
      knowledge["William Hang"] = "has";
      knowledge["Amulet"] = "known";
    }
    else if (thing == "Letter") {
      text = "You unfold the letter, and see a sketch of " +
             "something called the U.S. Hotel, along with an " +
             "address on Main Street.</br></br>The letter reads</br></br>" +
             "<q>Pat,</br>This is Palmyre's sketch of our new business, " +
             "and where we'd like it to be. We think that it'd be a fantastic " +
             "addition to Bodie's Main Street, and bring quite a pretty penny " +
             "to everyone involved. We'd like to consider it not only the best " +
             "hotel in the county, but a roaring center of trade. Now, if only " +
             "that old man would sell us the rights to his land, we could move " +
             "forward with the plan...</br>Earnestly,</br>James</q>";
             knowledge["Letter"] = "known";
    }

    return text;
  }

  return { applies: applies, effects: effects, text: text };

}

//go(agent, place) input: agent string, place string
//output { applies: boolean, effects: () -> string, text: string }
function go(agent, place) {

  var applies = location_of[agent] != place;
  var text = "";

  function effects() {
    location_of[agent] = place;
    var text = "";
    if (agent == "You") {
      //incorporating specific story line
      if (place == "Firehouse") {
        text = "The firehouse is empty today, the sun " +
          "gleaming off of its bell. Of interest " +
          "is a ditch containing what seems to be " +
          "the housing for a water valve.";

        if (knowledge["You"] == "unknown") {  
          knowledge["Firehouse"] = "known";
        }
        else {
          knowledge["Hat"] = "known";
        }
      }
      else if (place == "JS Cain's House") {
        text = "You knock on the door to no avail. " +
          "Peering into the lavish windows, " +
          "you see that nobody's home." +
          "You should check elsewhere.";
      }
    else if (place == "Jail") {
      if (knowledge["William Hang"] == "unknown") {//amulet is not in possesion of you
        text = "The man in the jail cell looks almost asleep. " +
               "</br ></br >Check somewhere else. ";
      }
      else if (knowledge["William Hang"] == "has") {
        text = "Hang looks awake, so you ask about " +
               "the events of the night, but he refuses to talk about that. <q>All I " +
               "want is to find my family,</q> is all you  " +
               "can get out of him. You reply that he's going " +
               "to have to help you out before you can make that " +
               "happen. He sits silently on the other side of the bars. " +
               "Absently, you pull out the amulet you found and take " +
               "another look. </br ></br >Hang's eyes go wide. <q>My god, " +
               "that survived the fire? I never suspected - thank you. " +
               "Please, can I have it?</q> ";
      }
      else if (knowledge["William Hang"] == "given") {
        text = "You've already spoken to the cook. He is turned " +
               "away, in the corner of the cell.";
      }
    }
      else if (place == "Bank") {
		if (knowledge["Insurance"] != "known") {
		  text = "You enter the imposing Bodie Bank, " +
          "the most modern and expensive of all " +
          "the buildings in town. The safe stands " +
          "severe in the center, between brick and " +
          "steel bar. Facing the opposite wall is a " +
          "redwood desk. <br /><br />" +

          "Sitting there is a straight backed man with " +
          "salt and pepper hair, furiously filing documents " +
          "and flipping through files. He jerks to a stop as " +
          "you approach, and stands, stiffly. He turns to you " +
          "and you notice his gaunt face and pale eyes. <br/><br/> " +
		  "You remember that Sherrif Hayes told you he had the " +
		  "insurance document for you.";
		 }
		else{ 
          text = "You enter the imposing Bodie Bank, " +
          "the most modern and expensive of all " +
          "the buildings in town. The safe stands " +
          "severe in the center, between brick and " +
          "steel bar. Facing the opposite wall is a " +
          "redwood desk. <br /><br />" +

          "Sitting there is a straight backed man with " +
          "salt and pepper hair, furiously filing documents " +
          "and flipping through files. He jerks to a stop as " +
          "you approach, and stands, stiffly. He turns to you " +
          "and you notice his gaunt face and pale eyes. ";
		}
		 
      }
      else if (place == "Bakery") {
        text = "You enter the ruins of the bakery. Scorched " +
          "bricks litter the ground, and white ash is " +
          "mixed into the dirt. The blaze that took out " +
          "half of Bodie started here. You see gnarled " +
          "cast iron about, indicating you're in the kitchen." +
          "<br /><br /> As you make your way through the " +
          "kitchen, you come across a one armed, portly man. " +
          "He is wearing a suit, despite the ashy ruin you " +
          "two stand in.";
      }
      else if (place == "Chinatown") {
        text = "You're struck by the massive amount of damage done " +
          "to the Chinatown of Bodie, north of town. It seems " +
          "that the fire truly torched the neighborhood.<br />You " +
          "recall a faint memory of a celebration here, with " +
          "brightly colored ribbons hanging over the streets " +
          "and a huge parade. Only an echo remains, in the few " +
          "red roofed homes miraculously left standing. <br /><br />" +
          "You investigate the nearest shack, torched on the " +
          "outside but fairly preserved inside. On a ramshackle " +
          "desk is a wooden amulet, on a twine string. Perplexed, " +
          "you pick it up. A faded sketch of a girl is inside. " +
          "<br /><br /> This is a desolate place.";
      }
      else if (place == "Perry House") {
        text = "Poking your head through the doorframe, you see a woman " +
          "in a rocking chair, head buried in her hands. Hearing the " +
          "draft, she looks up and sees you. Her face is lined with " +
          "stress and weathered by sun.</br>";
      }
      else if (place == "Wesley House") {
        text = "The Wesley house is austere and well kept. You go to knock on " +
          "the door, but at the first rap the door creaks open. " +
          "</br></br>You go inside the " + place + ".</br></br> You see a letter.";
      }
      else {
        text = agent + " go to " + place;
      }
    }

    return text;
  }

  return { applies: applies, effects: effects, text: text };

}

//wear(agent, thing) input: agent string, thing string
//output { applies: boolean, effects: () -> string, text: string }
function wear(agent, thing) {

  var applies = (agent == location_of[thing]) && (clothing_on(agent) != thing);
  var text = "";

  function effects() {
    clothing_on[agent] = thing;
    var text = "";

    if (clothing_on[agent] == "") {
      text = agent + " wears " + thing;
    }
    else {
      text = agent + " takes off " + clothing_on[agent] + " and wears " + thing;
    }

    return text;
  }

  return { applies: applies, effects: effects, text: text };

}

//talk(agent1, agent2) input: agent1 string, agent2 string
//output: { applies: boolean, effects: () -> string, text: string }
function talk(agent1, agent2) {

  var loc = location_of[agent1];
  var applies = loc == location_of[agent2] && agent1 != agent2;
  var text = "";

  function effects() {
    var text = "";

    if (agent1 == "You") {
      text = agent2 + " says hello to " + agent1 + "</br ></br >";
      //text += findTalk(npc, );
      if (agent2 == "Sheriff Hayes") {
        if ((knowledge["William Hang"] == "given") && (knowledge["Firehouse"] == "known")) {
          if (knowledge["You"] == "unknown") {
            text += "</br > You tell the sheriff what Hang told you about " +
              "the firehouse, and he grimaces.</br ></br >" +
              "Sheriff Hayes says, <q>I wish he had just told us his story. " +
              "I can't release him yet, but you should hunt down that lead. " +
              "Here's the key.</q></br ></br >You pocket it.";
            knowledge["You"] = "known";
          }
        }
        else if (knowledge["Firehouse"] == "known") {
          text = "You ask the Sheriff to unlock the firehouse.</br></br > " +
            "The Sheriff responds, <q>" +
            "Sorry kid, the firehouse is gonna stay locked up " +
            "tight unless you have a good reason to search it, " +
            "at the firefighters request.</q>";
        }
      }
      else if (agent2 == "Pat Wesley") {
        if (knowledge["Pat Wesley"] == "unknown") {
          text = "You ask Pat Wesley to give you some information about the Perrys.</br></br>" +
            "<q>They're in mourning " +
            "for their lost property, I suspect.</q></br ></br > Before you can get " +
            "in a word, he prattles on, </br ></br ><q>Yes, I represent them and " +
            "their businesses. I am here to... look for any sign of " +
            "foul play, and to reclaim any found valuables for the Perry " +
            "estate. A kind and noble pair they are. If you seek them, " +
            "check their home on Main Street, but I warn you, they're " +
            "likely to be in a sad state indeed.</q></br ></br >" +
            "<b>You now have access to the Perry and Wesley House</b>";
          locations.push("Perry House");
          locations.push("Wesley House");
          knowledge["Pat Wesley"] = "known";
        }
      }

      else if (agent2 == "Mr. Perry") {
        if (knowledge["Mr. Perry"] == "unknown") {
          text = "The man with the eyepatch stands straight and tall over " +
            "a squared off patch of land. He seems to be about sixty, " +
            "with a strong physique and confident demeanor. He stares " +
            "silently at the square. As you approach him, he looks you " +
            "in the eyes and says, <q>This is the spot I've picked for " +
            "my grave. You may find that odd, but somebody will have " +
            "to do it. I've decided to take the task into my own hands.</q> " +
            "</br></br><q>My name is James Perry. Mono County Supervisor. And you're " +
            "the deputy who's been looking into the fire.</q>";
          knowledge["Mr. Perry"] = "known";
        }
        else if ((knowledge["Mr. Perry"] == "known") && (knowledge["Letter"] == "known")) {
          text = "You show him the letter.</br></br>He smiles when you show him the " +
            "letter he sent to Pat Wesley. </br></br><q>Well, you're " +
            "quite the investigator, aren't you? Unfortunately, " +
            "that's not going to hold up in court. It's speculative, illegally " +
            "obtained, and with Wesley on my side no court will indict me on such " +
            "evidence. Besides. This is a place of constant change. Fires occur " +
            "naturally, after all - they destroy the dead wood.</q></br></br> He turns away " +
            "from you.";
        }
      }
      else if (agent2 == "Shotgun Johnny") {
        if (knowledge["Shotgun Johnny"] == "unknown") {
          text = "The short man strikes a comical figure, with a bulldog face " +
            "and a round black hat, similar to a sun hat.</br>You begin to " +
            "walk towards the man, but as you do, he saunters towards you " +
            "instead, breaking off his conversation. The tall man turns " +
            "back to the patch of land, brooding.</br>In a thick cornish " +
            "accent, he hollers, <q>Hello! I see you eyeing me. Well, I " +
            "decided I'd come over here, eye you instead. The prop's to " +
            "see how you like it.</q> He gets right up in your face. <q>They " +
            "call me Shotgun Johnny. Wanna guess why?</q> Menace flickers " +
            "in his eyes.</br></br>A tense moment passes, and he suddenly breaks out " +
            "in laughter.</br></br><q>Nah, I'm playin' with ya. What is it you want to say?</q>" +
            "There's still a bit of edge in his voice.";
          knowledge["Shotgun Johnny"] = "known";
        }
        else if ((knowledge["Hat"] == "known") && (knowledge["Shotgun Johnny"] == "known")) {
          text = "You show him the hat you found in the firehouse.</br></br><q>Yeah, " +
            "that's me hat...</q></br></br>Johnny blinks.</br></br><q>Where'd you find " +
            "that? I have another but that's my favorite. I got a prop " +
            "for ya - give it back? Please?</q></br></br>He realizes that he's " +
            "been made. <q></br></br>Damn. Alright, fine. I was there that night, " +
            "but you can't pin the arson on me. There's no way I could " +
            "have set the fire and sabotaged the water main at once. Now, " +
            "can I at least have my hat back?</q></br></br>You refuse to give him " +
            "the evidence.";
        }
      }
      else if ((agent2 == "Mrs. Perry") && (knowledge["Insurance"] == "known")) {
        text = "You pull out the document that Cain gave you and hand it to her. " +
          "Mrs. Perry is unimpressed.</br></br><q>Well? Why show me what I already " +
          "know? JS Cain likely told you I was up to no good, eh? He's " +
          "hated us for years.</q>";
      }
	  else if ((agent2 == "JS Cain") && (knowledge["Insurance"] != "known") && (location_of[agent1] == "Bank")) {
		text = "</br ></br >JS Cain reaches to his desk and " +
        "pulls a sheet of paper from a file. <q>Here's a " +
        "partial list of losses for the citizens of the town. " +
        "The damage is huge, exceeding 88,000 dollars...</q>" +
        "</br ></br > You take the insurance paper from him.</br ></br >" +
        "Cain continues, <q>I already see something fishy. Notice " +
        "that Mrs. Perry lost less than almost anyone? Considering " +
        "that a good number of the lost buildings were in direct " +
        "competition with Perry... Something seems off. I suggest " +
        "you look around her bakery.</q>";
        knowledge["Insurance"] = "known"; 
	  }
	  
    }

    return text;
  }

  return { applies: applies, effects: effects, text: text };
}

//give(agent1, agent2, thing) input: agent1 string, agent2 string, thing string
//output: { applies: boolean, effects: () -> string, text: string }
function give(agent1, agent2, thing) {

  var loc = location_of[agent1];
  var applies = (agent1 != agent2) && (agent1 == location_of[thing]) && (loc == location_of[agent2]);
  var text = "";

  //if npc given thing, i want npc to be "wearing" thing
  function effects() {
    var text = "";
    var graveYardAccess = 0;
    //graveYardAccess variable gives conditions for giving amulet, if we need to include another give this function needs to be edited
    if (thing == "Amulet" && agent2 == "William Hang") {
      graveYardAccess = 1;
    }

    if (graveYardAccess == 0) { }
    else {
      location_of[thing] = agent2
      locations.push("Graveyard");
      knowledge["William Hang"] = "given";

      if (clothing_on[agent1] == thing) {
        clothing_on[agent1] = "";
      }
    }
    if (graveYardAccess == 0) {
      text = "You try to hand the " + thing + " to " + agent2 + ".</br></br>" +
             agent2 + " responds, <q>No thank you, this " + thing + " is not mine.</q>";
    }
    else {
      text = agent1 + " give " + thing + " to " + agent2;
    }
    if (graveYardAccess > 0) {
      text = "You give Hang the amulet and he tells his story of what happend that night. </br></br>" +
		"<q>That night, I slipped out of the bakery around 1 AM. Work was especially brutal " +
		"and I needed some relief. I went to the saloon and drank myself silly, when I heard " +
		"a commotion outside. I stumbled out and saw the fire ripping through the town. I " +
		"could see the homes of my people burning on the hill.</q> </br></br>He chokes on these words, " +
		"and you see sorrow in his eyes. </br></br><q>I ran into the night. Only this morning did I " +
		"have the guts to investigate. My family was gone, my home torched. I didn't even " +
		"bother looking inside. That's when the sheriff and his men grabbed me, and threw me " +
		"in here. On my way to the bar I passed the firehouse, and heard a voice muttering " +
		"to itself, 'the prop's to break the line'. I think I know who it was, but he's a " +
		"dangerous man. I think he saw me that night and I'm sure he'll come for revenge " +
		"if he knows I sent you. Good luck, friend.</q></br></br> <b>You now have access to the Graveyard.</b>";
    }

    return text;
  }

  return { applies: applies, effects: effects, text: text };
}

//accuse(agent1, agent2) input: agent1 string, agent2 string
//output: { applies: boolean, effects: () -> string, text: string }
function accuse(agent1, agent2) {
  var text = "";
  var applies = agent1 != agent2;
  function effects(){
	var text = "";
	if (agent1 == "William Hang") {
	  text = "</br>You beleive that the sherriff had it right all along and that " +
	  "the arsonist was Hang. As you watch Sherrif Hayes load up Hang to be " + 
	  "transported to prison you have a nagging suspicion that maybe you " +
	  "missed something.";
	}
	else if (agent1 == "Shotgun Johnny" && agent2 == "The Perrys") {
	  text = "</br>After your thorough investigation of the town you feel " +
	  "confident when you tell sheriff Hayes that the Perrys had conspired " +
	  "with Shotgun Johnny.";
	}
	else{
	  text = "</br>You accuse Shotgun Johnny, with plenty of evidence aginst him." +
	  "However, you can't shake the feeling that he didn't work alone.";
	}
	return text;
  }
  return { applies: applies, effects: effects, text: text };
}

//examine(agent, thing) input: agent string, thing string
//output: { applies: boolean, effects: () -> string, text: string }
function examine(agent, thing) { //add to knowledge base
  
  applies = location_of[thing] == agent;
  var text = "";

  function effects() {
    var text = "";

    if (agent == "You") {
      for (var di in descriptions) {

        if (descriptions[di].thing == thing) {
          text = descriptions[di].descr;
        }
      }

      for (var ii in inventory) {

        if (inventory[ii].thing == thing) {
          text = inventory[ii].descr;
        }
      }
    }
    else {
      //add to NPC knowledge
    }

    return text;
  }

  return { applies: applies, effects: effects, text: text };
}

//open(agent, thing) input: agent string, thing string
//output: { applies: boolean, effects: () -> string, text: string }
function open(agent, thing) {
  
  var applies = location_of[agent] == closed_objects[thing];
  var text = "";

  function effects() {
    var text = "";

    if (agent == "You") {
      var unlocked = false;
      var unique_description = false;
    }

    if (thing == "Water Valve Housing") {
      if (agent == "You") {
        unique_description = true;

        if (knowledge["You"] == "known") {
          unlocked = true;
          text = "You use the key the sheriff gave you to open up " +
            "the lock on the valve housing.</br ></br>You remove the " +
            "cover, and sure enough, there's obvious evidence of " +
            "tampering. You see a flat black hat inside the valve " +
            "housing as well, similar to a sun hat. Stitched onto " +
            "the brim is a monogram, <q>SJ</q>.";
          location_of["Hat"] = "Firehouse";
          topics["Hat"] = "known"; 
        }
        else {
          text = "You try to look inside, but you're stopped by a heavy lock.";
          topics["Firehouse"] = "known";
        }
      }
      else { //if NPC opens
        unlocked = true;
        location_of["Hat"] = "Firehouse";
      }
    }
    else if (thing == "Bank Safe") {
      if (agent == "JS Cain") {
        unlocked = true;
        //location_of["Insurance Paper"] = "Bank";
        delete closed_objects[thing];
      }
    }

    if (agent == "You") {
      if (!unique_description) { //if has no unique description
        if (unlocked) {
          text = "You open " + thing + ".";
        }
        else {
          text = "You cannot open " + thing + ".";
        }
      }
    }

      //remove opened object from closed_objects
      if (unlocked) {
        delete closed_objects[thing];
      }

    return text;
  }

  return { applies: applies, effects: effects, text: text };
}