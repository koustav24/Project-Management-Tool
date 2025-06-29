import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Card, CardContent, Typography, Grid, Button, TextField, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Skeleton, Avatar, CircularProgress } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import WebLayout from "../Layouts/WebLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProjectSpecificTaskMutation, useGetSpecficProjectDetailsQuery } from "../../redux/api/api";
import axios from 'axios'
import { Delete, Edit, Folder } from "@mui/icons-material";
import EditProjectDialog from "../Dialog/EditProjectDialog";
import { useAsyncMutation } from "../Hooks/Hooks";
import toast from "react-hot-toast";

const LazyDeleteProjectDialog=lazy(()=>import('../Dialog/DeleteProjectDialog'));

const statusColors = {
  "In Progress": "warning",
  "Backlog": "secondary",
  "In Review": "info",
  "Todo": "error",
  "Done": "success"
};

const ProjectCard = () => {
  const navigate=useNavigate();
  const params=useParams();
  const projectId=params.id;

  const [selectStatus,setSelectStatus]=useState("");
  const [selectAssignee,setSelectAssignee]=useState("");

  const [tasks,setTasks]=useState([])
  const [open,setOpen]=useState(false);
  const [sortDateOrder,setSortDateOrder]=useState(1);
  const [assignTaskDialog,setassignTaskDialog]=useState(false);
  const [filteredTask,setFilteredTask]=useState([]);
  const [searchTask,setSearchTask]=useState("");
  const [openDeleteDialog,setOpenDeleteDialog]=useState(false)

  console.log(projectId)
  const [isLoading,setIsLoading]=useState(false);
const {data:ProjectQuery,isLoading:loadingProjectquery}=useGetSpecficProjectDetailsQuery(projectId);

const ProjectFQuery=useMemo(()=>{
  if(!loadingProjectquery){
    return ProjectQuery.pDetails;
  }
  return {}
})
 
const handleDelete=async(projectId)=>{
  setOpenDeleteDialog(true)
}

const handleStatusMenu=(e)=>{
  console.log(e.target.value)
  setSelectStatus(e.target.value)
  if(e.target.value !== ""){
    const result=tasks.filter((p)=>p.status.toLowerCase()===e.target.value.toLowerCase());
    return setFilteredTask(result)
  }
  
  setFilteredTask(tasks);

}

const handleAssigneeMenu=(e)=>{
  console.log(e.target.value)
  setSelectAssignee(e.target.value);
  if(e.target.value !== ""){
    const result = tasks.filter((p) => 
      p.assignedTo.some((l) => l.name.toLowerCase() === e.target.value.toLowerCase())
    );
    return setFilteredTask(result)
  }
  setFilteredTask(tasks);
}

useEffect(()=>{
  const fetchi=async()=>{
    try {    
      const {data}=await axios.post(`http://localhost:3000/task/projectTask?q=${sortDateOrder}`,{projectId},
      {
      withCredentials:true,
      headers:{
        "Content-Type":"application/json",
      }
      })
      console.log("bhyankar",data.tasks)
      setTasks(data.tasks)
      setFilteredTask(data.tasks)
      } catch (error) {
        console.log(error)
      }
  }
  fetchi();
},[projectId,sortDateOrder])

const handleTaskPage=(t)=>{
  console.log(t)
  navigate(`/task/${t}`)
}

const handleSearchTask=async(e)=>{
  setSearchTask(e.target.value);
}

useEffect(()=>{
  const timeId=setTimeout(()=>{
    if(searchTask){
      const result=tasks.filter((t)=>t?.title.toLowerCase().includes(searchTask.toLowerCase()))
      setFilteredTask(result)
    }else{
      setFilteredTask(tasks)
    }
    
  },500)

  return()=>clearTimeout(timeId)

},[searchTask,tasks])

console.log("Filtered Tasks",filteredTask)

console.log("query project",ProjectQuery)
console.log("AssignedTo:", tasks);
  return (
    <>
    <Suspense fallback={<CircularProgress sx={{display:"flex",justifyContent:"center"}} />}>
      {openDeleteDialog && <LazyDeleteProjectDialog open={openDeleteDialog} onClose={()=> setOpenDeleteDialog(false)}  projectId={projectId}  />}
    </Suspense>

    {loadingProjectquery?( <div>
          <Skeleton variant="text" width={200} height={"100%"} />
          <Skeleton variant="rectangular" width={300} height={"100%"} />
          <Skeleton variant="text" width={150} height={20} />
          {/* Add more skeletons as needed */}
        </div>):(
    <div style={{ padding: 20,width:"100%" }}>
      
      <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
          {ProjectFQuery.name}
          </Typography>
          </Grid>

          <Grid item mr={1} >
          
            
            <Button size="small" variant="outlined" sx={{mx:1}}
            color="primary" onClick={()=>setOpen(true)} >
              <Edit fontSize="small"/> Edit
            </Button>
            <Button size="small" variant="outlined" 
            color="error" onClick={()=>handleDelete(projectId)} disabled={isLoading} >
              <Delete fontSize="small"/> Delete
            </Button>
            
          </Grid>
          {open && <EditProjectDialog open={open} projectName={ProjectFQuery.name}  projectId={projectId} onClose={()=>setOpen(false)} />}
      </Grid>
      
      
      <Grid container spacing={2}>
        {["Total Tasks", "Assigned Tasks", "Incomplete Tasks", "Completed"].map((title, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <CalendarMonthIcon fontSize="large" color="primary" />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2">{title}</Typography>
                    <Typography variant="h6" fontWeight="bold">{[17, 2, 5, 2][index]}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Update: July 14, 2025
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
        
        {/* <Card sx={{ boxShadow: 1,my:1}}> */}
        {/* <CardContent> */}
        {ProjectFQuery.description!=="" && 
        <Grid container xs={12} >
          <Card sx={{ boxShadow: 1,my:1,width:"100%"}}>
          <CardContent >
          <Grid item xs={12}
          >
           <Typography variant="h6" fontWeight="bold">Description</Typography>
          </Grid>

          <Grid item xs={12} marginTop={2}>
          {ProjectFQuery.description || "sdasd"}
          </Grid>

          </CardContent>
          </Card>

        </Grid>}

        {ProjectFQuery.projectFile.length>0 &&<Grid container >
          <Card sx={{ boxShadow: 1,my:1,width:"100%"}} >
          <CardContent>
          <Grid item xs={12}
          >
           <Typography variant="h6" fontWeight="bold">Files</Typography>
          </Grid>

          <Grid>
          {ProjectFQuery.projectFile.map((h,index)=>{
            return(
              <Paper
              variant="outlined"
                key={index}
                sx={{
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#f5f5f5",
                  m:1,
                  cursor:"pointer"
                  }}
              >
                <Typography variant="body2" color="textSecondary">
                    <a
                     href={h.url}
                      target="_blank"
                      download 
                      onClick={()=>console.log(h)}
                     style={{textDecoration:"none",color:"inherit"}}
                       >
                    <Folder /> {h.filename}
                    </a>
                </Typography>
              </Paper>
            )
          })}
          </Grid>

          </CardContent>
            
          </Card>
         
        </Grid>
        }


        {/* </CardContent> */}
        {/* </Card> */}

        

      <Typography variant="h5" fontWeight="bold" fontFamily={"Figtree"} mt={1}>
          Project Members
        </Typography>
      <TableContainer component={Paper} elevation={5} sx={{mt:1}}>
        
        <Table>
          <TableHead>
            <TableRow>
              {["Avataar","Name","Task Assigned"].map((h)=>(
              <TableCell key={h} sx={{ fontWeight: "bold" }}>
              {h}
              </TableCell>         
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {ProjectFQuery.teamMembers.map(({name,profilePic})=>(
              <TableRow>
              <TableCell><Avatar src={profilePic} /></TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>3</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
       <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Grid item xs>
          <TextField size="small" label="Search item" 
          variant="outlined" fullWidth 
          value={searchTask}
          onChange={handleSearchTask}
           />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary">+ Assign Task</Button>
        </Grid>
      </Grid>
      {<Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
        <Select size="small" fullWidth displayEmpty value={selectStatus} onChange={handleStatusMenu} >
        <MenuItem value="">All statuses</MenuItem>
        {
          Object.keys(statusColors).map((l)=>(
            <MenuItem key={l} value={l}>{l}</MenuItem>
          ))
        }

      </Select>
        </Grid>
    
        <Grid item xs={12} sm={6}>
          <Select size="small" fullWidth displayEmpty value={selectAssignee} onChange={handleAssigneeMenu}>
            <MenuItem value="">All assignees</MenuItem>
            {
              [...new Set(tasks.flatMap((r)=>r.assignedTo.map(k=>k.name)))].map((h,index)=>(
                <MenuItem key={index} value={h}>{h}</MenuItem>
              ))

    
            }
          </Select>
        </Grid>
      </Grid>}
      <TableContainer component={Paper} elevation={4} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {["Task Name", "Assignee", "Due Date", "Status"].map((header) => (
                <TableCell key={header} sx={{ fontWeight: "bold",cursor:"pointer" }}
                onClick={header === "Due Date" ? () => setSortDateOrder((p)=>p===-1?1:-1) : undefined}
                >
                  {header}
                  </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTask.map((task, index) => (
              <TableRow key={index}>
                <TableCell onClick={()=>handleTaskPage(task._id)} sx={{cursor:"pointer"}}>{task.title}</TableCell>
                <TableCell>
                   {task.assignedTo.map((p)=>(
                    <div>
                    <AssignmentIcon style={{ marginRight: 5 }} />
                    {p.name}
                    </div>
                   ))}
                </TableCell>
                <TableCell style={{ color: "#black", fontWeight: "bold" }}>
                
                  {task.deadline? new Date(task.deadline).toLocaleDateString('en-GB').replace(/\//g,"-"):"N/A"
                  }</TableCell>
                <TableCell>
                  <Chip label={task.status} sx={{ backgroundColor: "#ED6C02", color: "white" }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
    </div>
  // )}
  )}
  </>
  );

};

export default WebLayout()(ProjectCard);
