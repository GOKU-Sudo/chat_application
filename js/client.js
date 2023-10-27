
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

const appendUserJoinedShow=(message,position)=>{  // function to display the user name when joined the chat
  const userJoinedMessage=document.createElement('div');
  userJoinedMessage.innerHTML=message;
  userJoinedMessage.classList.add("mssg");
  userJoinedMessage.classList.add(position);
  mssgContainer.append(userJoinedMessage);
}

const name2=prompt("Enter your name :");
console.log(mssgInp.value);
socket.emit("new-user-joined",name2);

socket.on("user-joined",name3=>{
  appendUserJoinedShow(`${name3} joined the chat`,'right');
})