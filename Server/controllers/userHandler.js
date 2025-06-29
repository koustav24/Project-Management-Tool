const {tryCatcher, ErrorHandler}=require('../utility/errorHandler.js')
const User=require('../models/user.js');
const PasswordReset=require('../models/passwdReset.js')
const bcrypt=require('bcrypt');
const { compare } = require('bcrypt');
const { generateToken } = require('../utility/features.js');
const jwt=require('jsonwebtoken')
const {transporter}=require('../utility/features.js');
const Notifications = require('../models/notifications.js');
const Project = require('../models/Projects.js');
const Task = require('../models/Task.js');

const signUpHandler=tryCatcher(async(req,res,next)=>{
    const { name, email, password,role } = req.body;

    let user = await User.findOne({ email });
        if (user) return next(new ErrorHandler("Email already exists",400));
    
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashedPassword,
        role:role|| "User"
      });
    
      await user.save();
      generateToken(res,user,201,"User Created");
})

const loginHandler=tryCatcher(async(req,res,next)=>{
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');

    if (!user) return(next(new ErrorHandler("Invalid Username",400)));
    
    const isMatch=await compare(password,user.password);

    if (!isMatch) return(next(new ErrorHandler("Invalid Password",403)));

    generateToken(res,user,201,"Welcome Back")

})

const googleHandler=tryCatcher(async(req,res,next)=>{
    const token=await jwt.sign({id:req.user._id},process.env.JWT_SECRET,{
        expiresIn: "7d",
    })
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    // res.json({msg:req.user})
    // generateToken(res,req.user,201,"Welcome");
    console.log("wwww")
    res.redirect('http://localhost:5173/dashboard')
})

const githubHandler=tryCatcher(async(req,res,next)=>{
    const token=await jwt.sign({id:req.user._id},process.env.JWT_SECRET,{
        expiresIn: "7d",
    })
    console.log("Github")
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    // res.json({msg:req.user})
    // generateToken(res,req.user,201,"Welcome");
    console.log("wwww")
    res.redirect('http://localhost:5173/dashboard')
})


const getMyProfile=tryCatcher(async(req,res,next)=>{
    const user=await User.findById(req.usero).select('-password');
    res.status(201).json({
        success:true,
        data:user
    })
})

const logoutHandler=tryCatcher(async(req,res,next)=>{
    req.session.destroy((err)=>{
        if(err){
            return next(new ErrorHandler("Logout Failed",500))
        }
        res.clearCookie("token")
        res.clearCookie("Sessiony");
        res.clearCookie("__Host-GAPS");
        // res.redirect("https://accounts.google.com/logout")
        res.json({success:true,message:"logged out"})
    })
})

const forgotPassword=tryCatcher(async(req,res,next)=>{
    const {email}=req.body;

    if(!email) return next(new ErrorHandler("Email is required",404))

    const user=await User.findOne({email});
    if(!user) return next(new ErrorHandler("User Not Found",404));

    const resetToken=jwt.sign({userId:user._id},process.env.JWT_FORGOT_SECRET
        ,{expiresIn:"10m"});
    

    await PasswordReset.create({userId:user._id,token:resetToken});

    const resetLink=`http://localhost:5173/resetPassword?token=${resetToken}`;

    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:user.email,
        subject:"Password Reset",
        html:`<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    })
    
    res.status(201).json({msg:"Reset Password Email sent Successfully!"})

})

const resetPasswd=tryCatcher(async(req,res,next)=>{
    
    const {resetToken,password}=req.body;
    console.log(resetToken,password)
    if(!resetToken || !password){
        return next(new ErrorHandler("input is required",404));
    }

    const passwordResetToken = await PasswordReset.findOne({ token:resetToken });
    console.log(passwordResetToken)
    if (!passwordResetToken) {
        return next(new ErrorHandler("Invalid or expired token", 400));
    }

    const decoded=jwt.verify(resetToken,process.env.JWT_FORGOT_SECRET);
    const user=await User.findById(decoded.userId);

    if(!user) return res.status(404).json({msg:"USer not Found"})
    
    
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password=hashedPassword
    await user.save();

    await PasswordReset.deleteOne({ token:resetToken });

    return res.json({message:"Password Reset Successfully"})
})

const getMembers=tryCatcher(async(req,res,next)=>{
    const u=await User.find({}).select('name _id');
    res.status(200).json({success:true,msg:"successfully fetched Members",members:u})
})

const getMyNotifications=tryCatcher(async(req,res,next)=>{
    const notify=await Notifications.find({reciever:req.usero}).populate('sender','name')

    const allNotifications=notify.map(({_id,sender,body})=>({
        _id,
        sender:{
            _id:sender._id,
            name:sender.name
        },
        body:body
    }))

    return res.status(201).json({
        success:true,
        notifyB:allNotifications
    })

})

const dashboardStats=tryCatcher(async(req,res,next)=>{
    if(req.admin ==="Admin"){
        const myProjects=await Project.find({})
                            .populate('creator','name')
        
        const totalProjects=myProjects.length;

        const transformedProjects=await Promise.all(
    
            myProjects.map(async({_id,name,creator,deadline,description,tasks})=>{
                    const totalTasks=tasks.length;
                    const completedTask=await Task.countDocuments({
                        projectId:_id,
                        status:{$in:["Completed"]}
                    
                    })
                    return(
                        {_id,name,creator,deadline,description,totalTasks,completedTask}
                    )
        })
    )

    }
    const myProjects=await Project.find({teamMembers:req.usero.toString()})
                    .populate('creator','name')

    const totalProjects=myProjects.length;
    console.log("Total Projects",totalProjects);

    const transformedProjects=await Promise.all(
    
        myProjects.map(async({_id,name,creator,deadline,description,tasks})=>{
                const totalTasks=tasks.length;
                const completedTask=await Task.countDocuments({
                    projectId:_id,
                    status:{$in:["Completed"]}
                
                })
                return(
                    {_id,name,creator,deadline,description,totalTasks,completedTask}
                )
    })
)
    
    const myTasks=await Task.find({assignedTo:req.usero})
                    .populate('projectId','name')
                    .sort({deadline:1})
                    .limit(5)
    
    const totalTaskCompleted=await Task.countDocuments({assignedTo:req.usero,
        status:{$in:["In Review","Completed"]}})
    
    
    res.status(200).json({sucess:true,transformedProjects,totalProjects,myTasks,totalTaskCompleted})
    

})


module.exports={signUpHandler,loginHandler,
    googleHandler,getMyProfile,logoutHandler,
    forgotPassword,resetPasswd,githubHandler,
    getMembers,getMyNotifications,dashboardStats
}