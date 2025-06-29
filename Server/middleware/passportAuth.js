const passport = require("passport");
const User=require("../models/user.js")
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const GithubStrategy=require('passport-github2').Strategy;
const axios=require('axios')
passport.use(
    new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:"http://localhost:3000/auth/google/callback"
    },
    async (accessToken,refreshToken,profile,cb)=>{
        try {
            let user= await User.findOne({googleId:profile.id});

            if(!user){
                user=new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    profilePic: profile.photos[0].value,
                });
                await user.save()
            }

            return cb(null,user)

        } catch (error) {
            return cb(error,null)
        }
    }
  )
)

passport.use(
    new GithubStrategy({
        clientID:process.env.GITHUB_CLIENT_ID,
        clientSecret:process.env.GITHUB_CLIENT_SECRET,
        callbackURL:"http://localhost:3000/auth/github/callback",
        scope:["user:email"]
    },
    async(accessToken, refreshToken, profile, done)=>{
        try{
            // console.log(profile)
            
            console.log(profile.emails[0].value)
            let email=profile.emails[0].value
            let user= await User.findOne({ email});
            if(!user){
                user=new User({
                    name: profile.displayName || profile.username,
                    email,
                    profilePic: profile.photos?.[0]?.value,
                });
                await user.save()
            }

            return done(null,user)

        }catch(e){
            return done(e,null)
        }
    }
)
)

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async(id, done) =>{
    const user=await User.findById(id);
    done(null,user)
})