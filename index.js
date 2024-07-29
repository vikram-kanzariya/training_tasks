const express = require("express");
const path = require('path');
const userRouter = require('./routes/route');
const cookieParser = require("cookie-parser");
const { cronJobs }  = require("./cron");
const configuration = require("./services/cloudinaryConfig");
const worker = require("./worker");
const scheduleCron = require("./services/generateCsv");


worker.on('completed' , (job) =>{
  console.log("Job ID: " , job.id)
});

cronJobs();
scheduleCron();

require('dotenv').config();

const app = express();

configuration();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use("/public" , express.static(path.join(__dirname , '/public')));

app.use("/" , userRouter);
app.set("view engine" , "ejs");
app.set("views" , './views');

const server = app.listen(process.env.PORT , () => {
  console.log(`Running on PORT: ${process.env.PORT}`);
});

var io = require('socket.io')(server);

app.set('socketio', io);

// Socket connection
io.on('connection' , (socket) => {
  socket.on("log-out", (token) => {
    io.emit(`log-out-${token}`);
  });
});