const mongoose = require("mongoose")

const connectDB=(url)=>{
    mongoose.connect(url)
    .then(d=>console.log("Connected to dB"))
    .catch((err)=>{
        throw err;
    })
}

module.exports=connectDB;