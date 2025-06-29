const jwt=require('jsonwebtoken')
const {ErrorHandler,tryCatcher}=require('../utility/errorHandler.js')
const User=require('../models/user.js')

const userAuth=tryCatcher(async(req,res,next)=>{
    const token=req.cookies['token'];

    if(!token) return next(new ErrorHandler("Please! Login First to access",401));

    const decodedData=jwt.verify(token,process.env.JWT_SECRET);
    const t=await User.findById(decodedData.id);
    req.usero=decodedData.id
    // console.log(req.usero)
    req.admin=t.role;
    console.log("auth admin",req.admin)
    next();
})
const isAdmin=tryCatcher(async(req,res,next)=>{
    const token=req.cookies['token'];
    console.log('token',token);
    if(!token) return next(new ErrorHandler("Please! Login First to access",401));
    const decodedData=jwt.verify(token,process.env.JWT_SECRET);
    req.usero=decodedData.id
    const t=await User.findById(req.usero);
    console.log(req.usero)
    req.admin=t.role;
    console.log("Fetched Role from DB:", t.role);
    if (!req.usero) {
        return next(new ErrorHandler("Admin accesso required",403))
    }
    if(req.admin !=="Admin"){
        return next(new ErrorHandler("Admin access required",403))
    }

      console.log("behen")
      console.log("pk");
      
    
    next()
})



const socketAuth=async(socket,err,next)=>{
    try {
        
        if(err) return next(err);
        console.log("Socket")
        const authToken=socket.request.cookies['token'];

        if(!authToken) return next(new ErrorHandler("Please SignIn/Up to access this route",403));
        const decodedData=jwt.verify(authToken,process.env.JWT_SECRET);
        const uso=await User.findById(decodedData.id);
        if(!uso){
            return next(new ErrorHandler("Please SignIn/Up to access this route",403));
        }
        socket.user=uso
        next()


    } catch (error) {
        return next(new ErrorHandler("please Login To access This route",401))
    }
}

module.exports={userAuth,socketAuth,isAdmin}