const mongoose=require('mongoose');

const msgSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat',
        required:true
    },
    content:{
        type:String
    },
    attachments:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true
            }
        }
    ]
    
},{timestamps:true})

const Message=mongoose.model('Message',msgSchema);
module.exports=Message
