const mongoose=require("mongoose");

const PasswordResetSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    token:{
        type:String,
        required:true
    },
    
})

const PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema);
module.exports=PasswordReset;