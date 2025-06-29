import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, useTheme } from "@mui/material"
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";


const AdminDeleteTaskDialog=({open,onClose,taskId})=>{
    const Theme=useTheme();
    const [loading,setLoading]=useState(false);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleDelete=async()=>{
        setLoading(true);
        const id=toast.loading("Logging out....");
        try {
            await axios.delete(`http://localhost:3000/admin/task/delete/${taskId}`,{
                withCredentials:true,
                headers: {
                    'Content-Type': 'application/json'  
                  }
            })
            toast.success("succesfully deleted the project",{id});
            navigate('/adminProjects')
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message || error.message,{id})
        }finally{
            setLoading(false)
        }

    }

    return(
        <Dialog open={open} onClose={onClose} 
        TransitionComponent={Fade} // Smooth transition
        transitionDuration={400} 
        >
            <DialogTitle>
                Delete Task
            </DialogTitle>
            <DialogContent>
                <DialogContentText >
                    Are you sure you want to Delete This Task?
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button color="error" onClick={onClose} disabled={loading} variant="outlined" >
                    Cancel
                </Button>

                <Button color="primary" onClick={handleDelete} disabled={loading} variant="contained"> 
                    Confirm
                </Button>

            </DialogActions>

        </Dialog>
    )
}

export default AdminDeleteTaskDialog;