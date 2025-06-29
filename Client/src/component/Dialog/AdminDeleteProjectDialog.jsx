import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme } from "@mui/material"
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const AdminDeleteProjectDialog=({open,onClose,projectId})=>{
    const Theme=useTheme();
    const [loading,setLoading]=useState(false);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleLogout=async()=>{
        setLoading(true);
        const id=toast.loading("Deleting The Project....");
        try {
            await axios.delete(`http://localhost:3000/admin/project/delete/${projectId}`,{
                withCredentials:true,
                headers: {
                    'Content-Type': 'application/json'  
                  }
            })
            toast.success("succesfully deleted the project",{id});
            navigate('/adminProjects')
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message || "Something went wrong",{id})
        }finally{
            setLoading(false)
        }

    }

    return(
        <Dialog open={open} onClose={onClose} >
            <DialogTitle>
                Delete Project
            </DialogTitle>
            <DialogContent>
                <DialogContentText >
                    Are you sure you want to Delete This Project?
                </DialogContentText>
            </DialogContent>

            <DialogActions>
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

export default AdminDeleteProjectDialog;