const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true,required:true},
  password: String,
  googleId: String,
  profilePic: String,
  githubId:String,
  role:{
    type:String,
    enum:["Admin","User"],
    default:"User"
  }
},{
  timestamps:true
});

module.exports = mongoose.model("User", userSchema);