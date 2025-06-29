const mongoose=require('mongoose');

const notificationSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reciever:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    body:{
        type:String
    }
},{timestamps:true})

const Notifications=mongoose.model("Notifications",notificationSchema);
module.exports=Notifications;