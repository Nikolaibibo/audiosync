window.onload = init;


var shelterSound;
var audioPath = "/";
var sounds = [
    {id:"shelter", src:"shelter.mp3"}
];


var isPlaying = false;
var hasBeenStarted = false;
var soundTime = 0;

// init  windows onLoad
function init() {
  createjs.Sound.addEventListener("fileload", handleLoad);
}

// externally called
function loadAudio() {
  createjs.Sound.registerSounds(sounds, audioPath);
}

function handleLoad(event) {
  console.log("sound loaded");
  //createjs.Sound.play("shelter");

  // TODO: put events in here to decouple...!
  statuscontainer.text("Sound is loaded!");
  playPausePage.show();

  socket.emit('audioLoaded', "xyz");
}



// externally called
// btn function
function playAudio (msg) {

  console.log("playhead from server: " + msg);

  if (!isPlaying && !hasBeenStarted) {
    //source.start(0);

    soundTime = 0;
    shelterSound = createjs.Sound.play("shelter");


    isPlaying = true;
    hasBeenStarted = true;
    playbutton.text("Pause");
  }else if (!isPlaying && hasBeenStarted) {

    shelterSound.play({offset:msg});

    isPlaying = true;
    playbutton.text("Pause");
  }else if (isPlaying) {
    soundTime = shelterSound.position;
    shelterSound.stop();
    isPlaying = false;
    playbutton.text("Resume");
  }

  socket.emit('playStatusChanged', { soundIsPlaying: isPlaying, time: roundFourDecimal(soundTime)});

  //console.log("currentTime: " + roundFourDecimal(shelterSound.position));
}


// internal helper function
function roundFourDecimal(x) {
  var Ergebnis = Math.round(x * 10000) / 10000;
  return Ergebnis;
}
