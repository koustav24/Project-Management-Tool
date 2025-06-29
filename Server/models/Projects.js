const mongoose=require('mongoose');

const projectSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    teamMembers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    tasks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Task'
    }],
    deadline:{
        type:Date
    },
    projectFile:[{
        filename:String,
        url:String,
        public_id: String,
    }],
    isArchived:{
        type: Boolean,
        default: false
    },
},{
    timestamps:true
})

module.exports=mongoose.model('Project',projectSchema);