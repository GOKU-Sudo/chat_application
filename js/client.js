
const socket = io("localhost:3000", {
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});


// const socket=io('http://localhost:3000',{transports:["websocket"]});

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

let name2=" ";

do{
  name2=prompt("Enter your name :");
}while(name2==null || name2.length==0){
  
};

console.log(mssgInp.value);
socket.emit("new-user-joined",name2); //

socket.on("user-joined",name3=>{
  appendUserJoinedShowAndMessage(`${name3} joined the chat`,'middle');
})

socket.on("recieve",messageRecieved=>{ //recieving message from server sent by users and dsiplaying it on chat box
  appendUserJoinedShowAndMessage(`${messageRecieved.name3}: ${messageRecieved.message}`,"left");
} )

formId.addEventListener("submit",(e)=>{ // event that listens on submit
                                          // and send the message to the chat box
const message=mssgInp.value;
 if(!message){
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