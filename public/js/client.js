
// const socket = io("http://localhost:5000", {
//   // extraHeaders: {
//   //   "my-custom-header": " "
//   // }
// });
// var http = require('http');
// const users = require('./data.js').userDB;





// require("@babel/register");

// const users = require('./data.js').userDB;
// console.log(users);

const socket=io();

const formId =document.getElementById("formId");
const mssgInp =document.getElementById("mssgInp");
const mssgContainer =document.querySelector(".container");

// console.log(mssgContainer.outerHTML);

const appendUserJoinedShowAndMessage=(message,position)=>{  // function to display the user name when joined the chat
  const userJoinedMessage=document.createElement('div');
  userJoinedMessage.innerHTML=message;
  userJoinedMessage.classList.add("mssg");
  userJoinedMessage.classList.add(position);
  mssgContainer.append(userJoinedMessage);
}


// let bool;

// let counter=0;

// while(true){
//   counter++;
//   if(counter>5){
//     window.close();
//   }
//   name2=prompt("Enter Username :");
//   if((name2==null || name2.length==0)){
//     name2=prompt("Enter Username :");
//   }
//   else{
//     bool=users.find((data) => name2===data.usernamae);
//     if(!bool){
//       prompt("Wrong Username");
//     }
//     else{
//       break;
//     }
//   }
// }

let DB=[];
let promptUsername;
let bool;
let counter;

socket.on("SendDB", DB2 => {
  DB = DB2;
  console.log(DB);
  do{
    counter=0;
    do{
      promptUsername=prompt("Enter Username :");
    }while(promptUsername==null || promptUsername.trim().length==0)

    
    // let User=DB.find((data) => name2===data.username);
    // const usernames = User.map(user => user.username);
    const User = DB.find((data) => promptUsername.trim() === data.username);

    if(User==undefined){
      counter++;
    }
    else{
      for (const key in User){
        if(User[key]===promptUsername){
          bool=true;
          break;
      }
        else bool=false; 
      }
    }
    if(bool==true) {
      socket.emit("new-user-joined",promptUsername);
      break;
    }
  
  }while(counter<5);
});


socket.emit("ReqDB");




if(counter==5) window.close();

console.log(promptUsername);
// console.log(DB);



socket.emit("new-user-joined",promptUsername); //

socket.on("user-joined",name3=>{
  appendUserJoinedShowAndMessage(`${name3} joined the chat`,'middle');
})

socket.on("recieve",messageRecieved=>{ //recieving message from server sent by users and dsiplaying it on chat box
  appendUserJoinedShowAndMessage(`${messageRecieved.name3}: ${messageRecieved.message}`,"left");
} )

// socket.on("SendDB", DB2 => {
//   DB = DB2;
//   if (DB.length > 0) {
//     console.log(DB);
//   }
// });

formId.addEventListener("submit",(e)=>{ // event that listens on submit
                                          // and send the message to the chat box
const message=mssgInp.value;
 if(!message){
   e.preventDefault();                  
   return false;
  }
  e.preventDefault();                  
  
  appendUserJoinedShowAndMessage(`you: ${message}`,"right");
  socket.emit("send",message);
  mssgInp.value="";
});

socket.on("left",name3=>{   // recieve from server when user lefts the chat
  appendUserJoinedShowAndMessage(`${name3} left the chat`,"leave");
});

