
function Game(filename) {
  this.load(filename)
}

Game.prototype.load = function(filename)
{
  console.log("Loading " + filename);
  var data = JsonRequest({
  	url: filename,
  	callback: function(err, data) {
  		console.log(data)
  	}
  })

}
