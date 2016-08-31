
function Game(filename, input, output) {
  this.filename = filename;
  this.input = input;
  this.output = output;
  this.input.value = "";
  input.addEventListener("keydown", function(evt) {
    this.userInput(evt)
  }.bind(this));
}

Game.prototype.load = function(callback) {

  var data = JsonRequest({
  	url: this.filename,
  	callback: function(err, data) {
  		this.init(data)
      callback()
  	}.bind(this)
  })
}

Game.prototype.init = function(data)
{
  var game = data.game;
  this.gameName = game.name;
  this.startingScene = game.starting_scene;
  this.scenes = game.scenes;
  this.deathMessage = game.death_message;
  this.finaleMessage = game.finale_message;
  var scene_count = Object.keys(this.scenes).length
  console.log(`Initialized game: ${this.gameName} (${scene_count} scenes)\n\n`);
}

Game.prototype.start = function() {
  this.gameState = "playing";
  this.loadScene(this.startingScene)
}

Game.prototype.loadScene = function(scene_name)
{
  var scene = this.scenes[scene_name];
  this.currentScene = scene;

  // split the text into paragraphs
  var paragraphs = scene.text.split("\n");

  // clear the game text container
  var node = this.output;
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

  // create a paragraph tag for each one
  for (var idx = 0 ; idx < paragraphs.length ; idx++) {
    var paragraph = paragraphs[idx];
    var textNode = document.createTextNode(paragraph);
    var pNode = document.createElement("p");
    pNode.appendChild(textNode);
    node.appendChild(pNode);
  }

  // add a separator
  var line = document.createElement("hr");
  node.appendChild(line);

  // add actions as an ordered list
  var actionListNode = document.createElement("ol");
  if (scene.actions) {
    for (var idx = 0; idx < scene.actions.length ; idx++) {
      var actionName = scene.actions[idx].name;
      var listItem = document.createElement("li");
      var textNode = document.createTextNode(actionName);
      listItem.appendChild(textNode);
      actionListNode.appendChild(listItem);
    }
    node.appendChild(actionListNode);
  }

  // run scripts if any
  if (scene.script) {
    for (var idx = 0; idx < scene.script.length ; idx++ ) {
      var cmd = scene.script[idx];
      this.runCommand(cmd, node);
    }
  }

  this.input.focus()
}

Game.prototype.runCommand = function(cmd, node)
{
  if (cmd.name == "die") {
    // player is dead
    var header = document.createElement("h3");
    header.appendChild(document.createTextNode(this.deathMessage));
    node.appendChild(header);
    this.gameState = "dead";
  } else if (cmd.name == "end_game") {
    // game was successfully completed
    var header = document.createElement("h3");
    header.appendChild(document.createTextNode(this.finaleMessage));
    node.appendChild(header);
    this.gameState = "dead";
  } else {
    console.log(`Unrecognized script command "${cmd.name}"`);
  }
}

Game.prototype.performAction = function(code) {
  var scene = this.currentScene;
  var action = scene.actions[code - 1];
  var nextScene = action.scene;
  this.loadScene(nextScene);
}

Game.prototype.userInput = function(evt) {

  if (this.gameState == "playing") {

    // game is being played, keyboard input is used to pick among actions
    if (evt.keyCode == 13) {
      var actionCode = Number(this.input.value);
      if (!isNaN(actionCode)) {
        if ((actionCode > 0) && (actionCode <= this.currentScene.actions.length)) {
          this.input.value = "";
          this.performAction(actionCode);
        }
      }
      this.input.value = null;
    }

  } else if (this.gameState == "dead") {

    // player is dead, any keyboard input should restart the game
    this.start()
    this.input.value = null;
    evt.preventDefault()
  }


}
