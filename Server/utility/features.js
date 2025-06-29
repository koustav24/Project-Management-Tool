const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer');
const { getSockets } = require('../lib/Helper');
const cookieOptions={
    httpOnly: true, // Prevents XSS attack
    secure: false, // Change to true in production with HTTPS
    sameSite: "Lax",
}

const generateToken = (res,user,code,msg) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
    });

    // Remove password before sending data
    const {password,...userWithoutPassword}=user.toObject()

    res.status(code).cookie("token", token,cookieOptions)
    .json({success:true,user:userWithoutPassword,msg});


};

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

const emitEvent=(req,event,users,data)=>{
    console.log("Emitting Event",event);
    console.log("Emitting EventU",users);
    const io=req.app.get('io');
    const userSocket=getSockets(users);
    console.log("jana",userSocket);
    io.to(userSocket).emit(event,data);
}



module.exports={generateToken,transporter,emitEvent}