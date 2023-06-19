var socket;
var usernameInput;
var chatIDInput;
var messageInput;
var chatRoom;
var dingSound;
var messages = [];
var delay = true;

function onload() {
  socket = io();
  usernameInput = document.getElementById("NameInput");
  chatIDInput = document.getElementById("IDInput");
  messageInput = document.getElementById("ComposedMessage");
  chatRoom = document.getElementById("RoomID");
  dingSound = document.getElementById("Ding");

  socket.on("join", function(room) {
    chatRoom.innerHTML = "";
  });

  socket.on("recieve", function(message) {
    console.log(message);
    if (messages.length < 9) {
      messages.push(message);
      dingSound.currentTime = 0;
      dingSound.play();
    } else {
      messages.shift();
      messages.push(message);
    }
    for (var i = 0; i < messages.length; i++) {
      // Split the message into name and content
      var splitMessage = messages[i].split(" : ");
      var name = splitMessage[0];
      var content = splitMessage[1];

      document.getElementById("Message" + i).innerHTML =
        '<span class="name">' + name + "</span>" + " : " + content;
      document.getElementById("Message" + i).style.color = "#FFFDD0";
    }
  });
}

function Connect() {
  socket.emit("join", chatIDInput.value, usernameInput.value);
}

function Send() {
  if (delay && (isValidLink(messageInput.value) || isValidMessage(messageInput.value))) {
    delay = false;
    setTimeout(delayReset, 1000);
    socket.emit("send", messageInput.value);
    messageInput.value = "";
  }
}

function isValidLink(message) {
  // Regular expression to check if the message is a valid link or base64 image link
  var linkRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  var base64ImageRegex = /^data:image\/(png|jpeg|jpg|gif);base64,/;

  return linkRegex.test(message) || base64ImageRegex.test(message);
}

function isValidMessage(message) {
  // Count the number of words in the message
  var wordCount = message.trim().split(/\s+/).length;

  // Check if the message has a word count of 2 or 3
  return wordCount >= 2 && wordCount <= 3;
}

function delayReset() {
  delay = true;
}
