const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
    taskId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Task',
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    Title:{
        type:String,
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{timestamps:true})

const Comment=mongoose.model('Comment',commentSchema);

module.exports=Comment;