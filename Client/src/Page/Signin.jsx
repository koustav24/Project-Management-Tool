import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Typography, IconButton, Box, Divider } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { GitHub, Google } from "@mui/icons-material";
import ForgotPasswordDialog from '../component/Dialog/FogotPasswordDialog';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import TeamLogo from './TeamLogo';
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux'
import { userExists } from '../redux/reducers/auth';

const Signin = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch()

  const [showPassword, setShowPassword] = useState(false);
  const handleOpen = () => setOpen(true);
  const [isLoading,setisLoading]=useState(false);

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error, setError] = useState(false);
  const [errorP, setErrorP] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [helperTextP, setHelperTextP] = useState("");
  const [open,setOpen]=useState(false)
  
      const handleLogin=async()=>{
        // if(error === false && errorP === false){  
          try {    
            setisLoading(true)
            const {data}=await axios.post("http://localhost:3000/login",{email,password},
            {
            withCredentials:true,
            headers:{
              "Content-Type":"application/json",
            }
        })
        console.log(data)
        dispatch(userExists(data.user))
        toast.success(data?.msg)
              
        navigate('/dashboard')
        
      } catch (error) {
          console.log(error)
          toast.error(error?.response?.data?.message || "Something went Wrong")
      }finally{
        setisLoading(false);
      // } 
    }
    }
    const googleLogin = async() => {
            try {
              window.location.href = "http://localhost:3000/auth/google";
                console.log(data)
                
                navigate('/dashboard')
                
            } catch (error) {
                console.log(error)
            }
    
          };

    const githubLogin=()=>{
      try {
        window.location.href = "http://localhost:3000/auth/github";
          console.log(data)   
          navigate('/dashboard')
      } catch (error) {
          console.log(error)
      }
    }

          const validateEmail = () => {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
              setError(true);
              setHelperText("Please enter a valid email address.");
            } else {
              setError(false);
              setHelperText("");
            }
          };
          const validatePassword=()=>{
            const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
            if(!passwordRegex.test(password)){
              setErrorP(true);
              setHelperTextP("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.");
    
            }else{
              setErrorP(false);
              setHelperTextP("");
            }
          }
          

  return (
    <>
    <TeamLogo />
    <Container maxWidth="lg" sx={{
      height:"100vh",
      display:'flex',
      alignItems:"center",
      justifyContent:"center",
      // overflow:"hidden",
      padding:0
    }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center"  sx={{ height: "100%", maxHeight: "100vh" }} >
        {/* Left Section */}
        <Grid item xs={12} md={6} sx={{ height: "100%", paddingX: 2 }} >
          
          
          <Typography 
              variant="h4" 
              sx={{ 
                
                fontWeight: 600, 
                fontFamily: "Poppins",
                color:"rgb(68, 66, 66)"
              }}
              margin={3}
            >
              Sign In
          </Typography>
          
          
          
          <TextField
          label="Email"
          onBlur={validateEmail}
                    value={email}
                    error={error}
                    helperText={helperText}
                    onChange={(e)=>setEmail(e.target.value)}
          placeholder='john@gmail.com'
          variant="outlined"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
             '& fieldset': {
                borderColor: 'rgb(24, 23, 23)', 
              }
            }
          }}
          InputLabelProps={{
            shrink: true, // Keeps the label visible even when not focused
          }}
          margin='normal'
          />
          
            <TextField  fullWidth  label="Password"
            placeholder='password'
             value={password}
             onChange={(e)=>setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'} 
             InputLabelProps={{
              shrink: true, 
            }} 
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}

            variant="outlined" margin='normal'
            sx={{
              '& .MuiOutlinedInput-root': {
               '& fieldset': {
                  borderColor: 'rgb(24, 23, 23)', 
                }
              }
            }}
            />
          
            <Typography sx={{display:"flex",flexDirection:"row-reverse",cursor:"pointer"}} 
            variant='caption'
            onClick={handleOpen}
            
             >
                Forgot Password?
            </Typography>
            {open && <ForgotPasswordDialog open={open} setOpen={setOpen} />}

          <Button fullWidth variant="contained"
          disabled={isLoading}
           color="primary" onClick={handleLogin} 
          size="large" sx={{ mt: 2,backgroundColor:"#1565C0"}}><Typography variant='caption'>Sign In</Typography></Button>
           
          <Typography align="center" variant="body2" fontWeight={500} sx={{color:"rgb(66, 65, 65)"}} mt={2} >
            Create an account? <Typography component="span" variant='body1' color="primary" sx={{cursor:"pointer"}} onClick={()=>navigate('/signup')}>Sign Up</Typography>
          </Typography>
          
          <Divider variant='middle' sx={{color:'rgb(104, 100, 100)',mt:1}}>Or Sign in with</Divider>
          <Typography align="center" variant="body2" color="textSecondary" mt={1}></Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GitHub />}
            sx={{ textTransform: "none" , color: "rgb(24, 23, 23)", // Text color black
              borderColor: "gray", // Border color gray
              "&:hover": {
                borderColor: "black", // Border darkens on hover
              },}}
              onClick={githubLogin}
          >
            Github
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{ textTransform: "none", color: "rgb(24, 23, 23)", // Text color black
              borderColor: "gray", // Border color gray
              "&:hover": {
                borderColor: "black", // Border darkens on hover
              }, }}
              onClick={googleLogin}
          >
            Google
          </Button>
        </Grid>
    </Grid>
    </Grid>
        
        {/* Right Section */}
        <Grid
        item
        xs={12}
        md={6}
        
        sx={{
          display: { xs: "none", md: "flex" }, 
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
        
          component="img"
          src="src/assets/Group 4.png" // Replace with your image path
          alt="Login Illustration"
          sx={{
            width: "100%",
            height:"80vh",
            maxWidth: "500px", // Prevents stretching
            objectFit: "contain",
          }}
        />
      </Grid>
      </Grid>
    </Container>
    </>
  );
};

export default Signin;
