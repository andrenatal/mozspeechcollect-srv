var fs = require('fs');
var http = require('http');
// Serve client side statically
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);

// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server});

// Wait for new user connections
bs.on('connection', function(client){
  // Incoming stream from browsers
  client.on('stream', function(stream, meta){
  	if ( meta.name != "next" ){
  		console.log("writing:" + __dirname+ '/public/' + meta.name);
	    var file = fs.createWriteStream(__dirname+ '/public/' + meta.name);
	    stream.pipe(file);
	} else {
			fs.readdir(process.cwd() + '/public/', function (err, files) {
			  if (err) {
			    console.log(err);
			    return;
			  }
			  var totalfiles = 0;
			  var hasfiles = false;
			  for (var i = 0; i < files.length; i++){

			  	if (files[i].indexOf(".wav") > -1) {
			  		var path = files[i].replace(".wav",".txt");
			  		var filename = files[i];

			  		if (!fs.existsSync(__dirname+ '/public/' + path)){
			  				totalfiles++;

			  				if (hasfiles)
			  					continue;

					  		var textasr = files[i].replace("audio.wav","word.txt");
							var asr = fs.readFileSync(__dirname+ '/public/' + textasr).toString();
							console.log(asr + " - " + textasr);
				  			stream.write({next: filename, n: "ok", asr: asr});
				  			hasfiles = true;
			  		}
			  	}
			  }
			  if (!hasfiles){
				console.log("send nok - finished" + hasfiles);
  				stream.write({n: "nok"});
  			  }
  				stream.write({n: "totalfiles", totalfiles: totalfiles});
			});
		}
  });
});

server.listen(9000);
console.log('HTTP and BinaryJS server started on port 9000');
