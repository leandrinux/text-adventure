var JsonRequest = function(options) {

  var method = options.method || "GET"
  var url = options.url

  var callback = options.callback || function(err, data) {
    console.error("options.callback was missing for this request");
  };

  if (!url) {
    throw 'loadURL requires a url argument';
  }

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.onreadystatechange = function() {
    try {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(null, JSON.parse(xhr.responseText));
        } else {
          callback(new Error("Error [" + xhr.status + "] making http request: " + url));
        }
      }
    } catch (err) {
      console.error('Aborting request ' + url + '. Error: ' + err);
      xhr.abort();
      callback(new Error("Error making request to: " + url + " error: " + err));
    }
  };

  xhr.open(method, url, true);

  if (options.headers) {
    Object.keys(options.headers).forEach(function(key) {
      xhr.setRequestHeader(key, options.headers[key]);
    });
  }

  xhr.send();

}

// JsonRequest({
// 	url: "https://www.ifixit.com/api/2.0/guides",
// 	callback: function(err, data) {
// 		console.log(data)
// 	}
// })
