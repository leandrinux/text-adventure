
// dynamically loads javascript scripts, calls handler when done
var evaluateCode = function(urls, handler)
{
  var count = urls.length;
  var checkCount = function() {
    count--;
    if (!count) {
      handler();
    }
  }

  urls.map(function(url) {
    var scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.onload = checkCount;
    // scriptTag.onreadystatechange = handler;
    document.body.appendChild(scriptTag);
  })

};

// loads all game scripts
evaluateCode([
  "JsonRequest",
  "Game"
].map(function(script) {
  return `scripts/${script}.js`
}), function() {
  // starts the game
  var input = document.getElementById("game_input")
  var output = document.getElementById("game_text");
  var game = new Game("caperucita.json", input, output);
  game.load(function() {
    game.start();
  })
})
