

const socket=io("https://chatgoku.onrender.com/");

const formId =document.getElementById("formId");
const mssgInp =document.getElementById("mssgInp");
const mssgContainer =document.querySelector(".container");



const appendUserJoinedShowAndMessage=(message,position)=>{  // function to display the user name when joined the chat
  const userJoinedMessage=document.createElement('div');
  userJoinedMessage.innerHTML=message;
  userJoinedMessage.classList.add("mssg");
  userJoinedMessage.classList.add(position);
  mssgContainer.append(userJoinedMessage);
}


let DB=[];
let promptUsername;
let bool;
let counter;

socket.on("SendDB", DB2 => {
  DB = DB2;
  counter=0;
  do{
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
  if(counter==5) {
    alert("Exceded Try limit \n Login again");
    socket.disconnect(); // Added disconnect code to disconnect socket connection
  }

  
});


socket.emit("ReqDB");



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

