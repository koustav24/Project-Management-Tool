import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Link } from "@mui/material";
import { useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";

const ForgotPasswordDialog = ({open,setOpen}) => {
  const [email, setEmail] = useState("");
  const [isLoading,setisLoading]=useState(false);
  

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleResetPassword = async() => {
    setisLoading(true);
    console.log("Reset link sent to:", email);
    const toastId=toast.loading("loading")
    try {
      const {data} =await axios.post("http://localhost:3000/forgotPassword",{email},{
        headers:{
          "Content-Type":"application/json",
        }
      })
      toast.success(data?.msg,{id:toastId});
      console.log(data)
    } catch (error) {
      
      console.log("reset",error)
      toast.error(error?.response?.data?.message || "Something went Wrong",{id:toastId})
    }finally{
      setisLoading(false)
    }
    handleClose();
  };

  return (
    <div>
      
      {/* Forgot Password Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle >Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" marginBottom={2}>
            Enter your email address, and we'll send you a link to reset your password.
          </Typography>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              shrink: true, // Keeps the label visible even when not focused
            }} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleResetPassword}  sx={{color:"white",backgroundColor:"#1565C0"}}
            disabled={isLoading}
          variant="contained">
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ForgotPasswordDialog;
