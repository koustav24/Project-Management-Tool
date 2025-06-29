require('dotenv').config();
const express =require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const session = require("express-session");
const mongoose=require('mongoose')
require('./middleware/passportAuth.js');
const passport = require('passport');
const Message=require('./models/message.js')

// Socket import
const {Server}=require('socket.io')
const {createServer}=require('http')


const userRoute=require('./routes/user.js');
const projectsRoute=require('./routes/project.js');
const taskRoute=require('./routes/task.js');
const chatRoute=require('./routes/chats.js');
const commentRoute=require('./routes/comments.js');
const adminRoute=require('./routes/admin.js');

const { ErrorMiddleware } = require('./utility/errorHandler.js');
const connectDB = require('./utility/DBconnect.js');
const { socketAuth } = require('./middleware/Auth.js');
const { userSocketIds, getSockets } = require('./lib/Helper.js');
const chat = require('./models/chat.js');


connectDB("mongodb://localhost:27017/Authyt");
const app=express();

// Socket

const server=createServer(app);
const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173","http://localhost:3000"],
        credentials:true
    }
})

app.set('io',io)


app.use(cors({
    origin:"http://localhost:5173"
    ,credentials:true,
    methods:['POST', 'GET', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
    })
);


app.use(
    session({
        secret:"cats",
        resave:false,
        name:"Sessiony",
        saveUninitialized:false,
        cookie:{secure:false,
            httpOnly:true,
            maxAge:7 * 24 * 60 * 60 * 1000

        }
    })
)

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use('/',userRoute);
app.use('/projects',projectsRoute);
app.use('/task',taskRoute);
app.use('/chats',chatRoute);
app.use('/comments',commentRoute);
app.use('/admin',adminRoute)

app.use(ErrorMiddleware)

io.use((socket,next)=>{
    cookieParser()(socket.request,socket.request.res,async(er)=>{
        await socketAuth(socket,er,next)
    })
})

io.on("connection",(socket)=>{

    console.log("Socket Connection",socket.id)
    const tempUser=socket.user;

    if(!tempUser || !tempUser._id){
        console.error("Invalid user. Disconnecting socket:", socket.id);
        socket.disconnect();
        return;
    }

    userSocketIds.set(tempUser._id.toString(),socket.id);

    socket.on("NEW_MSG",async({chatId,members,message})=>{
        const realTimeMsg={
            _id:Date.now(),
            content:message,
            sender:{
                _id:tempUser._id,
                name:tempUser.name
            },
            chat:chatId,
            createdAt:new Date().toISOString(),
        }
        // console.log("socReal",realTimeMsg)
        const dBMsg={
            sender:tempUser._id,
            chat:chatId,
            content:message
        }

        console.log('Emmitti    ng');
        const memberSocket=getSockets(members);
        console.log("msf",memberSocket)
        io.to(memberSocket).emit("NEW_MSG",
            {
            chatId,
            msg:realTimeMsg
        })
        
    await Message.create(dBMsg)

    })

    socket.on("disconnect",()=>{
        console.log("Disconnected", socket.id);
        userSocketIds.delete(tempUser._id);
        console.log("User deleted Succesfully")
    })


})


server.listen(3000,()=>{
    console.log("Server running on http://localhost:3000")
})