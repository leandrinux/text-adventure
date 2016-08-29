
function Game(filename) {
  this.load(filename)
}

Game.prototype.load = function(filename) {

  var data = JsonRequest({
  	url: filename,
  	callback: function(err, data) {
  		this.init(data)
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
  console.log(`Initialized game: ${this.gameName} (${scene_count} scenes)`);
}
