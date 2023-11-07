

const socket=io("https://chatgoku.onrender.com/");


// const socket = io(" ");

const formId = document.getElementById("formId");
const mssgInp = document.getElementById("mssgInp");
const mssgContainer = document.querySelector(".container");



const appendUserJoinedShowAndMessage = (message, position) => {  // function to display the user name when joined the chat
  const userJoinedMessage = document.createElement('div');
  userJoinedMessage.innerHTML = message;
  userJoinedMessage.classList.add("mssg");
  userJoinedMessage.classList.add(position);
  mssgContainer.append(userJoinedMessage);
}


let DB1 = [];
let DB2 = [];
let promptUsername;
let boolUser;   // for checking if user exist;
let boolLogged; // for checking if user is logged in
let counter;

socket.on("SendDB", (DB1, DB2) => {
  DB1 = DB1;
  DB2 = DB2;
  console.log(DB2);
  let loggedInUsers = Object.values(DB2);
  console.log(loggedInUsers);
  counter = 0;
  do {
    do {
      promptUsername = prompt("Enter Username :");
    } while (promptUsername === null || promptUsername.trim().length == 0)


    const User = DB1.find((data) => promptUsername.trim() === data.username);

    if (User == undefined) {
      counter++;
    }
    else {
      for (const key in User) {
        if (User[key] == promptUsername) {
          boolUser = true;
          break;
        }
        else boolUser = false;
      }
    }

    for (const i in loggedInUsers) {
      if (promptUsername == loggedInUsers[i]) {
        boolLogged = true;
        console.log(`${promptUsername} and ${loggedInUsers[i]}`)
        break;
      }
      else{
        boolLogged=false;
      }
    }

    if(boolLogged==undefined) boolLogged =false;

    if ((boolUser == true) && (boolLogged == false)) {

      socket.emit("new-user-joined", promptUsername);
      boolUser = false;
      break;
    }
    else if((boolUser == true) && (boolLogged == true)){
       alert("Already Logged in \nGo back to login page");
       socket.disconnect();
       break;
    }

  } while (counter < 5);
  if (counter === 5) {
    alert("Exceded Try limit \n Login again");
    socket.disconnect(); // Added disconnect code to disconnect socket connection
  }

});


socket.emit("ReqDB");



socket.on("user-joined", name3 => {
  appendUserJoinedShowAndMessage(`${name3} joined the chat`, 'middle');
})

socket.on("recieve", messageRecieved => { //recieving message from server sent by users and dsiplaying it on chat box
  appendUserJoinedShowAndMessage(`${messageRecieved.name3}: ${messageRecieved.message}`, "left");
})


formId.addEventListener("submit", (e) => { // event that listens on submit
  // and send the message to the chat box
  const message = mssgInp.value;
  if (!message) {
    e.preventDefault();
    return false;
  }
  e.preventDefault();

  appendUserJoinedShowAndMessage(`you: ${message}`, "right");
  socket.emit("send", message);
  mssgInp.value = "";
});


socket.on("left", name3 => {   // recieve from server when user lefts the chat
  if (name3 != null) {
    appendUserJoinedShowAndMessage(`${name3} left the chat`, "leave");
  }
});

