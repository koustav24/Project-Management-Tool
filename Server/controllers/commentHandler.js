const Comment = require("../models/comments");
const Notifications = require("../models/notifications");
const Task=require('../models/Task')

const { tryCatcher, ErrorHandler } = require("../utility/errorHandler");
const { emitEvent } = require("../utility/features");


const getComments=tryCatcher(async(req,res,next)=>{
    
    const id=req.params.id;
    console.log("Comment",id)
    const comments=await Comment.find({taskId:id})
        .populate('creator','name profilePic');
        
        if(!comments){
            return next(new ErrorHandler("No Comments Found",404))
        }

    res.status(200).json({success:true,comments})
});

const newComment=tryCatcher(async(req,res,next)=>{
    const {taskId,body}=req.body;

    const t=await Task.findById(taskId);
    if(!t){
        return next(new ErrorHandler("No Task Found With That Id",404));
    }
    const commenty=await Comment.create({
        taskId:taskId,
        body:body,
        creator:req.usero
    })

    await Notifications.create({
        sender:req.usero.toString(),
        reciever:t.assignedTo,
        body:`New Comment is Added on Task ${t.title} .... `,
        Title:`New Comment is Added on Task ${t.title}`
    })


    emitEvent(req,'New_Comment',t.assignedTo,{assigned:t.assignedTo})

    res.status(201).json({success:true,msg:"Successfully created Comments",commenty})

})

module.exports={
    newComment,getComments
}