const mongoose=require('mongoose');

const taskSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true
    },
    assignedTo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    status:{
        type:String,
        enum:['In Progress','Completed','In Review'],
        default:'In Progress'
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    deadline:{
        type:Date
    },
    reminder:{
        type:String
    }
},{timestamps:true})

module.exports=mongoose.model('Task',taskSchema);