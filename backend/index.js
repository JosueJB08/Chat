const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin:"http://localhost:5173",
        methods: ["GET","POST"],
    }
});

io.on("connection", (socket) => {

    socket.on("join_room", (data) => {
        socket.join(data)
        // console.log(`Usuario actual: ${socket.id} se unió a la sala ${data}`);
    })

    socket.on("send_messages", (data) => {
        socket.to(data.room).emit("receive_message", data);
        console.log(data);
    })

    socket.on("disconnect", () => {
        // console.log("Usuario desconectado" , socket.id);
    })
})


server.listen(3001, () => {
    console.log('SERVER RUNNING')
})