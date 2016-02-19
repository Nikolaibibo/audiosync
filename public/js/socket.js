// sockets and handler
var socket = io();
var clientName = "anonymous";

ntp.init(socket);

socket.on('user joined', function(data){
  console.log("user joined: " + data.username + "   -   totalUsers: " + data.numUsers);
  connectedUsers.text("Users connected: " + data.numUsers);
  logpage.append( data.username +" joined<br>" );
});

socket.on('user left', function(data){
  console.log("user left: " + data.username + "   -   totalUsers: " + data.numUsers);
  connectedUsers.text("Users connected: " + data.numUsers);
  logpage.append( data.username +" left<br>" );
});

socket.on('loadAudio', function(msg){
  //console.log("loadAudio: " + msg.status);
  // sound.js -> loadAudio()
  loadAudio();
});


socket.on('playAudioServer', function(msg){
  //console.log("playAudioServer: " + msg);
  // sound.js -> loadAudio()
  playAudio();
});

socket.on('playPauseAudioServer', function(msg){
  console.log("playPauseAudioServer: " + msg);
  // sound.js -> loadAudio()
  playAudio(msg);
});


socket.on('pauseAudioServer', function(msg){
  //console.log("pauseAudioServer: " + msg);
  // sound.js -> loadAudio()
  pauseAudio();
});
