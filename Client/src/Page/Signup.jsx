import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Typography, IconButton, Box, Divider, MenuItem } from '@mui/material';
import axios from 'axios'
import {  Google,GitHub } from "@mui/icons-material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import TeamLogo from './TeamLogo';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const Signup = () => {
  const navigate=useNavigate()
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setconfirmPassword]=useState("");
  const [role, setRole] = useState("user");
  const [isLoading,setisLoading]=useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState(false);
  const [errorP, setErrorP] = useState(false);
  const [errorPc,setErrorPc]=useState(false);
  const [helperText, setHelperText] = useState("");
  const [helperTextP, setHelperTextP] = useState("");
  const [helperTextpc,setHelperTextpc]=useState("");

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
    if (!passwordRegex.test(password)) {
      setErrorP(true);
      setHelperTextP("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.");
    } else {
      setErrorP(false);
      setHelperTextP("");
    }
  
    if (password && confirmPassword && password !== confirmPassword) {
      setErrorPc(true);
      setHelperTextpc("Passwords do not match.");
    } else {
      setErrorPc(false);
      setHelperTextpc("");
    }
  }
  const handleSignup=async()=>{
      
         if(error === false && errorP === false){
          setisLoading(true);
          const toastId=toast.loading("wait a couple of minutes");
          try {
              const name=`${firstName} ${lastName}`;
              console.log(role)
              const {data}=await axios.post("http://localhost:3000/signup",{name,email,password,role},
              {
                withCredentials:true,
                headers:{"Content-Type":"application/json"}
              })
              
              console.log(data)
             toast.success(data?.msg,{id:toastId});
               navigate('/dashboard')
               }catch (error) {
                console.log(error)
                toast.error(error?.response?.data?.message || "Something Went Wrong",{id:toastId}) 
              }finally {
                setisLoading(false);
              }
            }else{
              toast.error("Check The above input properly")
            }
  }
  const githubHandler=()=>{
    try {
      window.location.href = "http://localhost:3000/auth/github";
        console.log(data)   
        navigate('/dashboard')
    } catch (error) {
        console.log(error)
    }
  }
  
  const googleLogin = async() => {
    try {
      window.location.href = "http://localhost:3000/auth/google";
        console.log(data)
        
        navigate('/dashboard')
        // window.location.href="/dashboard";
    } catch (error) {
        console.log(error)
    }

  
        };
  
  
  return (
    <>
    <TeamLogo />
    <Container maxWidth="lg" sx={{
      height:"100vh",
      display:'flex',
      alignItems:"center",
      justifyContent:"center",
      padding:0
    }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center"  sx={{ height: "100%", maxHeight: "100vh" }} >
        {/* Left Section */}
        <Grid item xs={12} md={6} sx={{ height: "100%", paddingX: 2 }} >
          
          
          <Typography 
              variant="h4" 
              sx={{ 
                color: "rgb(68, 66, 66)", 
                fontWeight: 600, 
                fontFamily: "Poppins",
                mb:1
              }}
            >
              Sign up
          </Typography> 
          <Typography color="textSecondary" mb={3} variant='body2' sx={{color:"rgb(66, 65, 65)"}}>
            Let's get you all set up so you can access your personal account.
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
            <TextField
            label="First Name"
            defaultValue="Team"
            variant="outlined"
            value={firstName}
            onChange={(e)=>setFirstName(e.target.value)}
        fullWidth
        sx={{
        '& .MuiOutlinedInput-root': {
         '& fieldset': {
            borderColor: 'rgb(68, 65, 65)', 
          }
        }
      }}
      InputLabelProps={{
        shrink: true, // Keeps the label visible even when not focused
      }}
    />
            </Grid>
            <Grid item xs={6}>
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e)=>setLastName(e.target.value)}
              defaultValue="Sync"
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: 'rgb(68, 65, 65)', 
                  }
                }
              }}
              InputLabelProps={{
                shrink: true, 
              }}
            />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
            <TextField
            label="Email"
            defaultValue="john.doe@gmail.com"
            variant="outlined"
            fullWidth
            onBlur={validateEmail}
            value={email}
            error={error}
            helperText={helperText}
            onChange={(e)=>setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
              '& fieldset': {
                  borderColor: 'rgb(68, 65, 65)', 
                }
              }
            }}
            InputLabelProps={{
              shrink: true, 
            }}
            margin='normal'
          />
            </Grid>
            <Grid item xs={6}>
            <TextField
            variant='outlined'
              select
              value={role}
              label="Role"
              
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              required
              margin='normal'
              
              sx={{
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: 'rgb(68, 65, 65)', 
                  }
                }
              }}
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </TextField>

            </Grid>
          </Grid>
          
            <TextField  fullWidth  label="Password" type={showPassword ? 'text' : 'password'} 
             InputLabelProps={{
              shrink: true, // Keeps the label visible even when not focused
            }} 
            value={password}
            onBlur={validatePassword}
            error={errorP}
            helperText={helperTextP}
            onChange={(e)=>setPassword(e.target.value)}        

            variant="outlined" margin='normal'
            sx={{
              '& .MuiOutlinedInput-root': {
               '& fieldset': {
                  borderColor: 'rgb(68, 65, 65)', 
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
            />
            
            <TextField fullWidth label="Confirm Password" 
            type={showConfirmPassword ? 'text' : 'password'} 
            InputLabelProps={{
              shrink: true, // Keeps the label visible even when not focused
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowConfirmPassword((p)=>!p)} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
            value={confirmPassword}
            onChange={(e)=>setconfirmPassword(e.target.value)}
            onBlur={validatePassword}
            error={errorPc}
            helperText={helperTextpc}
            margin='normal'
            sx={{
              '& .MuiOutlinedInput-root': {
               '& fieldset': {
                  borderColor: 'rgb(68, 65, 65)', 
                }
              }
            }}
            variant="outlined" />
            
          
          
          <Button fullWidth variant="contained" color="primary"
          size="large" sx={{ mt: 2,backgroundColor:"#1565C0"}}
          onClick={handleSignup} disabled={isLoading}
          >Sign Up</Button>
           
          <Typography align="center" variant="body2" fontWeight={500} sx={{color:"rgb(66, 65, 65)"}} mt={2} >
            Already have an account? <Typography component="span" variant='body1' color="primary" sx={{cursor:"pointer"}} onClick={()=>navigate('/signin')}>Login</Typography>
          </Typography>
          
          <Divider variant='middle' 
              sx={{color:"rgb(104, 100, 100)",mt:1}}>
                Or Sign up with
          </Divider>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GitHub />}
            sx={{ textTransform: "none" , color: "rgb(0, 0, 0)", // Text color black
              borderColor: "gray", 
              "&:hover": {
                borderColor: "black", 
              },}}
              onClick={githubHandler}
          >
            Github
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{ textTransform: "none", color: "rgb(8, 8, 8)",
              borderColor: "gray",
              "&:hover": {
                borderColor: "black",
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

export default Signup;
