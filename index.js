// This js file will set up and manage the users connections

// const express = require('express');
// const app = express();
// const http = require('http');
// const httpServer = http.createServer(app);
// const io = require("socket.io")(httpServer, {
//   cors: {
// //     origin: 'http://127.0.0.1:5501',
//     origin: '*',
// //     methods: ["GET", "POST"],
//     methods: " ",
//   }
// });

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.use(express.static('public'));

app.get('/',(req,res)=>{
      res.sendFile(__dirname+'/index.html');
});
// hi
    

// const io = require("socket.io")(3000);
// const cors = require("cors");

const port=process.env.port || 5000;

server.listen(port,()=>{
      console.log("server running boss!!");
});
const users = {};

// Allow requests from all origins/particular origins

io.on("connection",socket=>{           // This is instance of socket.io. This listens the connection of different users that want's to connect,
                                       // ex- Goku wants to connect/send, Rohit, Arjun want's to conenct 
      socket.on("new-user-joined",name3=>{  // user-joined is a event. socket.on handles what to do  with the particular user which is connected to socket.io server.
            console.log("NewUserJoined ",name3);
            users[socket.id]=name3;
            socket.broadcast.emit("user-joined",name3);
           
      });
      socket.on("send",message=>{ // send is particular event if happens and message is the call back fucntion 
            socket.broadcast.emit('recieve',{message:message,name3:users[socket.id]})
      });

      socket.on("disconnect",doThis=>{ // to inform all client when users lefts the chat
            socket.broadcast.emit("left",users[socket.id]);
            delete users[socket.id];
      });

})
