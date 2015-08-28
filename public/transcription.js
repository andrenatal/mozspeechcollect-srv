var client = new BinaryClient('ws://speechan.cloudapp.net:9000');
var offline = true;
var txtname = "";
var audiofile = "";


// Wait for connection to BinaryJS server
client.on('open', function(){
    offline = false;
});

// Wait for connection to BinaryJS server
client.on('error', function(){
    offline = true;
	alert("You have disconnected. Please, refresh the page.");
});

window.onload = function () {
	document.querySelector("#sendbutton").onclick = function (){
		try {
			transcr = document.querySelector("#transcription").value;
			console.log(document.querySelector("#transcription").value);
	        stream = client.send(transcr, {name: audiofile.replace(".opus",".txt"), size: transcr.length});
	    } catch (err) {
	        alert("You have disconnected. Please, restart the appplication.");
	        return;
    	}
		document.querySelector("#thankyou").innerHTML = "Thank you! Now please start it over from step 1.";
	}

	document.querySelector("#nextbutton").onclick = function (){
		loadnext();
	}
}

function loadnext(){
	document.querySelector("#thankyou").innerHTML = "";
	var stream = client.send("n", {name:  "next" , size: 1});
	stream.on('data', function(data){
		if (data.n == "ok") {
			audiofile = data.next;
			document.querySelector("#audioel").src = audiofile;
			document.querySelector("#audioel").play();
		} else if (data.n == "nok") {
			alert("Thank you! We don't have anymore files.")
		}
	});
}



