var theWindow = $(window);
// local elements
var statuscontainer = $('#status');
var ownName = $('#ownname');
var connectedUsers = $('#connectedusers');
var usernameInput = $('.mdl-textfield__input');
var loginPage = $('#loginBox');
var infoPage = $('#infobox');
var logpage = $('#log');
var playPausePage = $('#playpausepage');

var playbutton = $('#playbutton');
var iosplaybutton = $('#iosplaybutton');
var letsgobutton = $('#letsgo');

var username;

function traceTime () {
  var d = new Date();
  var str = d.getHours() + ":" + d.getMinutes() + "." + d.getSeconds() + "." + d.getMilliseconds();

  console.log("Time: " + str);
  console.log("serverdate: " + ServerDate());
}

function init() {
  playPausePage.hide();
  logpage.hide();
  //setInterval(traceTime, 1000);
}

theWindow.keydown(function (event) {
  // Auto-focus the current input when a key is typed
  if (!(event.ctrlKey || event.metaKey || event.altKey)) {
  usernameInput.focus();
  }
  // When the client hits ENTER on their keyboard
  if (event.which === 13) {
    if (!username) {
      setUsername();
    }
  }
});

// Sets the client's username
function setUsername () {

  username = usernameInput.val();
  //console.log("setUsername: " + username);
  // If the username is valid
  if (username) {

    loginPage.hide();
    socket.emit('add user', username);
    ownName.text("My name is " + username);

    infoPage.css({ "visibility": "visible"});
    playPausePage.css({ "visibility": "visible"});
    logpage.show();
  }
}


letsgobutton.on('click', function() {
  console.log("letsgobutton clicked!");
  if (username) {
    sendMessage();
  } else {
    setUsername();
  }
});

// play button emits event to server onClick
// server reacts by sending a play command to ALL clients

playbutton.on('click', function() {
  console.log("playButton clicked!");
  socket.emit('playPauseAudioClient', ntp.offset());
});


init();
