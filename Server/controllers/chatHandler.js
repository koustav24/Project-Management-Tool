const Chat = require("../models/chat");
const User=require('../models/user.js')
const Message=require('../models/message')
const { tryCatcher, ErrorHandler } = require("../utility/errorHandler.js");
const { uploadToCLoudinary } = require("../cloudinary/config.js");
const { emitEvent } = require("../utility/features.js");


const getMyChats=tryCatcher(async(req,res,next)=>{
  
  const groups=await Chat.find({
      $or:[
        {members:req.usero},
        {creator:req.usero}
      ]     
    }).populate("members","name")

    const grpy=groups.map(({members,_id,name})=>({
        _id,
        name,
        members
    }))

    res.status(201).json({success:true,gChats:grpy})

})

const getMsgs=tryCatcher(async(req,res,next)=>{
  const chatId=req.params.chatId;
  // console.log("msg",chatId)
  const chat=await Chat.findById(chatId);
  // console.log("msg",chat)
  console.log(12);
  

  if(!chat) return next(new ErrorHandler("Chat Not Found",404))

  if(!chat.members.includes(req.usero) && req.admin !=="Admin" ){
    return next(new ErrorHandler("You are not Allowed to access this Chat",403))
  }
  

  const [msgs,totalMsgsCount]=await Promise.all(
    [Message.find({chat:chatId})
      .populate('sender','name')
      .sort({createdAt:1})
      .lean()
      ,
      Message.countDocuments({chat:chatId})
    ])
    console.log(12);

    res.status(201).json({
      success:true,
      msg:msgs,
      totalMsgs:totalMsgsCount
    })

})

const getMyChatDetails=tryCatcher(async(req,res,next)=>{
  const {chatId}=req.params;
  const chatu=await Chat.findById(chatId).populate('members','name').lean();
  if(!chatu){
    return next(new ErrorHandler("Chat Not Found",401));
  }

  const members=chatu.members.map(({_id})=>(
    {
      _id
    }
  ))

  return res.status(200).json({
    success:true,
    chatu,
    members
  })

})

const sendAttachMents=tryCatcher(async(req,res,next)=>{
  console.log(req.body);
  const {chatId}=req.body;

  const [chatu,me]=await Promise.all([
    Chat.findById(chatId),
    User.findById(req.usero)
  ])

  if(!chatu) return next(new ErrorHandler("Chat Not Found",401));
  const files=req.files || [];
  if(files.length<1) return next(new ErrorHandler("Please Provide attachments",403));

  const attachments=await uploadToCLoudinary(files);
  const dBmsg={content:'',chat:chatId,attachments:attachments,sender:me._id};
  const realTimeMsg={...dBmsg,sender:{
    _id:me._id,
    name:me.name
  }}

  const message=await Message.create(dBmsg);

  emitEvent(req,"NEW_MSG",chatu.members,{
    msg:realTimeMsg,
    chatId
  })

  res.status(200).json({
    success:true,
    message
  })

})


module.exports={getMyChats,getMsgs,getMyChatDetails,sendAttachMents}
