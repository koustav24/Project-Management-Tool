const mongoose=require('mongoose');

const chatSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
})

module.exports=mongoose.model("Chat",chatSchema);