window.onload = init;
var context;
var bufferLoader;
var source;
var isPlaying = false;
var hasBeenStarted = false;

function pause() {
    source.disconnect();
}

function resume() {
    source.connect(context.destination);
}

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  context = new AudioContext();



  bufferLoader = new BufferLoader(
    context,
    [
      'shelter.mp3'
    ],
    finishedLoading
    );

  //bufferLoader.load();
}

function loadAudio() {
  bufferLoader.load();
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  source = context.createBufferSource();
  source.buffer = bufferList[0];
  source.connect(context.destination);

  // TODO: put events in here to decouple...!
  statuscontainer.text("Sound is loaded!");
  playPausePage.show();

  socket.emit('audioLoaded', "xyz");

}

// btn function
function playAudio () {
  if (!isPlaying && !hasBeenStarted) {
    source.start(0);
    isPlaying = true;
    hasBeenStarted = true
    playbutton.text("Pause");
  }else if (!isPlaying && hasBeenStarted) {
    resume();
    isPlaying = true;
    playbutton.text("Pause");
  }else if (isPlaying) {
    isPlaying = false;
    pause();
    playbutton.text("Resume");
    //console.log("double play detected");
  }
  //socket.emit('playStatusChanged', isPlaying);

  socket.emit('playStatusChanged', {
    soundIsPlaying: isPlaying,
    time: roundFourDecimal(context.currentTime)
  });

  console.log("currentTime: " + roundFourDecimal(context.currentTime));
}



function roundFourDecimal(x) {
  var Ergebnis = Math.round(x * 10000) / 10000;
  return Ergebnis;
}
