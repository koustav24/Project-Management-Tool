import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  InputAdornment,
  Container,
  Box
} from "@mui/material";
import { Token, Visibility, VisibilityOff } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const location=useLocation();
    const [resetToken,setResetToken]=useState("");
    const navigate=useNavigate();
    const [isLoading,setIsLoading]=useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(()=>{
        const params=new URLSearchParams(location.search);
        const token=params.get("token");
        if(token){
            setResetToken(token);
        }else{
            navigate('/signup')
        }
    },[location.search])

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword=()=>setShowConfirmPassword(!showConfirmPassword)
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      console.log(password)
      setIsLoading(true);
      const toastId=toast.loading("Yeah! Updating The password")
        try {
            const {data}=await axios.put('http://localhost:3000/resetPassword',
            {resetToken,password}, 
            {headers:{
                "Content-Type":"application/json",
                
              },
            }
            )
            toast.success(data?.message,{id:toastId})
        navigate('/signin')
        } catch (error) {
            console.log("erry",error)
            toast.error(error?.response?.data?.message || "Something went Wrong",{id:toastId})
        } finally{
          setIsLoading(false)
        }    
    } else {
      toast.error("Passwords do not match!");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, width: "100%" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom textAlign="center" fontWeight="bold">
              Reset Password
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{ mt: 2, bgcolor: "primary.main", fontWeight: "bold" }}
              >
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ResetPassword;
