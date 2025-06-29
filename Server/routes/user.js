const express=require('express');
const passport = require('passport');
const { userAuth } = require('../middleware/Auth.js');
const { googleHandler, loginHandler, signUpHandler, logoutHandler, getMyProfile, forgotPassword, resetPasswd, githubHandler, getMembers, getMyNotifications, dashboardStats } = require('../controllers/userHandler.js');
const route=express.Router();

route.post("/login",loginHandler);
route.post("/signup",signUpHandler);

route.get("/auth/google"
    ,passport.authenticate("google", { scope: ["profile", "email"] }));
route.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    googleHandler)

    // githubHandler
route.get("/auth/github",(req,res,next)=>{
    console.log("fit")
    next()
},passport.authenticate('github',{scope:['user:email']})
)

route.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    githubHandler
)


route.post('/forgotPassword',forgotPassword)
route.put('/resetPassword',resetPasswd)

route.use(userAuth)

route.post('/logout',logoutHandler)
route.get('/me',getMyProfile)
route.get('/members',getMembers)
route.get('/notif',getMyNotifications)
route.get('/dashStats',dashboardStats);

module.exports=route