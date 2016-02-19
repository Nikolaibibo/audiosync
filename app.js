'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ntp = require('socket-ntp');

var musicIsPlaying = false;
var currentSoundTime = 0;
var masterPlayhead = 0;
var numUsers = 0;
var usernames = {};

// for static files
app.use(express.static('public'));

// server hardcoded HTML for connected clients
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/audio.html');
});

// socket server handler
io.on('connection', function(socket){

  console.log('unknown user connected');
  ntp.sync(socket);

  socket.on('disconnect', function(){

    if (numUsers > 0 && socket.username != undefined) {

      --numUsers;

      console.log('a user disconnected::: ' + socket.username + " ::::     activeUsers: " + numUsers);
      io.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });


  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;

    // echo globally (all clients) that a new user has connected
    io.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });

    console.log('user joined::: ' + socket.username + " ::::     activeUsers: " + numUsers);
  });

  // if audio is loaded by the client, it emits "audioLoaded"
  socket.on('audioLoaded', function(msg){
    console.log('audioLoaded: ' + msg);
  });

  // if client pushed play buttons, it emits the "playAudioClient" event
  // Server responds with the emit of an event to ALL clients
  socket.on('playAudioClient', function(msg){
    console.log('playAudioClient: ' + " by user " + socket.username);
    io.emit('playAudioServer', "abc");
  });

  socket.on('playPauseAudioClient', function(msg){
    //console.log('playPauseAudioClient: ' + " by user " + socket.username + " with delay: " + msg);
    // TODO: give playhead time
    io.emit('playPauseAudioServer', masterPlayhead);
  });

  // if client pushed pause buttons, it emits the "pauseAudioClient" event
  // Server responds with the emit of an event to ALL clients
  socket.on('pauseAudioClient', function(msg){
    console.log('pauseAudioClient: ' + " by user " + socket.username);
    io.emit('pauseAudioServer', "abc");
  });

  socket.on('playStatusChanged', function(msg){
    console.log('playStatusChanged: ' + " by user " + socket.username + "    status is: " + msg.soundIsPlaying + "   playhead: " + msg.time);
    musicIsPlaying = msg.soundIsPlaying;
    masterPlayhead = msg.time;
    checkDelays(msg.time);
  });

  // load audio by default after connect
  io.emit('loadAudio', {file: "test.mp3", status: musicIsPlaying});
});


var submittedTimestampsCount = 0;
var submittedTimestamps = [];




function checkDelays (time) {

  submittedTimestamps.push(time);
  submittedTimestampsCount++;

  if (submittedTimestampsCount == numUsers) {
    //console.log("all times received");

    for (var i = 0; i < submittedTimestamps.length; i++) {

      console.log("TIMESTAMP::::::::: " + submittedTimestamps[i]);

      // TODO: compare playhead time and choose the smallest for all devices

    }

    //console.log("difference::: " + (submittedTimestamps[0] - submittedTimestamps[1]));

    submittedTimestampsCount = 0;
    submittedTimestamps = [];
  }
}

// listen for connections on port 3000
http.listen(8080, function(){
  console.log('listening on *:8080');
  //traceTime();

  //setInterval(traceTime, 1000);
});
