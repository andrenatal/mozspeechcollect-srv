var client = new BinaryClient('ws://'+window.content.location.host);
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
	        stream = client.send(transcr, {name: audiofile.replace(".wav",".txt"), size: transcr.length});
	    } catch (err) {
	        alert("You have disconnected. Please, restart the appplication.");
	        return;
    	}
		document.querySelector("#thankyou").innerHTML = "Thank you! Now please start it over from step 1.";
	}

	document.querySelector("#discardbutton").onclick = function (){
		try {
			transcr = "XXXXXX";
			console.log(document.querySelector("#transcription").value);
	        stream = client.send(transcr, {name: audiofile.replace(".wav",".txt"), size: transcr.length});
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
			document.querySelector("#transcription").value = data.asr;
		} else if (data.n == "nok") {
			alert("Thank you! We don't have anymore files.")
		} else if (data.n == "totalfiles") {
			document.querySelector("#totalfiles").innerHTML = "We have " + data.totalfiles + " files remaining.";
		}
	});
}



