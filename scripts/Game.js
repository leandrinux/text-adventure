
function Game(filename, input, output) {
  this.filename = filename;
  this.input = input;
  this.output = output;
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
  var game = data.game
  this.gameName = game.name;
  this.startingScene = game.starting_scene;
  this.scenes = game.scenes;
  var scene_count = Object.keys(this.scenes).length
  console.log(`Initialized game: ${this.gameName} (${scene_count} scenes)\n\n`);
}

Game.prototype.start = function() {
  this.loadScene(this.startingScene)
}

Game.prototype.loadScene = function(scene_name)
{
  var scene = this.scenes[scene_name];
  var text_lines = [scene.text];

  if (scene.actions) {
    text_lines.push("\n")
    for (idx in scene.actions) {
      var action = scene.actions[idx];
      text_lines.push(`${Number(idx) + 1}. ${action.name}`);
    }
  }
  this.output.value = text_lines.join("\n");
  this.input.focus()
}

Game.prototype.userInput = function(evt) {
  if (evt.keyCode == 13) {
    var action_code = Number(this.input.value);
    if (!isNaN(action_code)) {
    }
    this.input.value = null;
  }
}
