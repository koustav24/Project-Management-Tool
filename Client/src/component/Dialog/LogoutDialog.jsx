import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme } from "@mui/material"
import axios from "axios";
import { useDispatch } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";


const LogoutDialog=({open,onClose})=>{
    const Theme=useTheme();
    const [loading,setLoading]=useState(false);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleLogout=async()=>{
        setLoading(true);
        const id=toast.loading("Logging out....");
        try {
            await axios.post("http://localhost:3000/logout",{},{
                withCredentials:true,
            })
            dispatch(userNotExists());
            toast.success("Logout Succesfully",{id});
            navigate('/signin')
        } catch (error) {
            console.log(error)
            toast.error("Error while logging out",{id})
        }finally{
            setLoading(false)
        }

    }

    return(
        <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth >
            <DialogTitle>
                Logout Confirmation
            </DialogTitle>
            <DialogContent>
                <DialogContentText >
                    Are you sure you want to Logout?
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{py:2}}>
                <Button color="error" onClick={onClose} disabled={loading} variant="outlined" >
                    Cancel
                </Button>

                <Button color="primary" onClick={handleLogout} disabled={loading} variant="contained"> 
                    Confirm
                </Button>

            </DialogActions>

        </Dialog>
    )
}

export default LogoutDialog;