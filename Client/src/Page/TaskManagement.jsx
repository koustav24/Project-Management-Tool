import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, Typography, Checkbox, Chip, TableSortLabel,
   Grid, Button,Card,
  CardContent,
  Box,
  TablePagination,
  IconButton,
  Menu,
  Skeleton,
  CircularProgress
} from "@mui/material";
import WebLayout from "../component/Layouts/WebLayout";
import { CalendarMonth, CheckBox, MoreVert } from "@mui/icons-material";
import AddNewTaskDialog from "../component/Dialog/AddNewTaskDialog";
import { useGetMyTasksQuery } from "../redux/api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const statusColors = {
  "In Progress": "warning",
  "Backlog": "secondary",
  "In Review": "info",
  "Todo": "error",
  "Done": "success"
};

const LazyEditDialog=lazy(()=>import('../component/Dialog/EditTaskDialog'));
const LazyDeleteDialog=lazy(()=> import('../component/Dialog/DeleteTaskDialog'));

const TaskManagement = () => {
  const navigate=useNavigate()
  const [tasks,setTasks]=useState([])
  const [sortBy, setSortBy] = useState("dueDate");
  const [showEditTask, setShowEditTask] = useState(false);
  
  const [sortDirection, setSortDirection] = useState("asc");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [openTDialog,setopenTDialog]=useState(false);
  const [filteredTask,setFilteredTask]=useState([]);
  const [selectedTaskProjectId,setselectedTaskProjectId]=useState("")
  const [openDDialog,setopenDDialog]=useState(false);

  // Menus
  const [selectStatus,setSelectStatus]=useState("");
  const [selectAssignee,setSelectAssignee]=useState("");
  const [selectProject,setSelectProject]=useState("");
  
  
  const {data:myTasks,isLoading:tasksLoading} =useGetMyTasksQuery();
  console.log("mYTasks taks",myTasks?.tasks);
  
  useEffect(()=>{
    if(!tasksLoading && myTasks?.tasks){
      console.log("bhenkelodo",myTasks?.tasks)
      setTasks(myTasks.tasks)
      setFilteredTask(myTasks.tasks)
    }
  },[tasksLoading,myTasks])
  
  const rowsPerPage = 4;
  const handleMenuOpen = (event, rowId,proId) => {
    setAnchorEl(event.currentTarget);
    console.log("rowID",rowId)
    setSelectedRow(rowId);
    setselectedTaskProjectId(proId)
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
    // setShowEditTask((p)=>!p)
  };

  const handleDeleteTaskDialog=()=>{
    setopenDDialog(true);
  }


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleTask=()=>{
    console.log("add")
    setopenTDialog(true);
  }

  const statuses = [
    { label: "Overdue", count: 470 },
    { label: "Pending", count: 270 },
    { label: "In progress", count: 270 },
    { label: "Completed", count: 370 },
    { label: "On time", count: 470 },
  ];
  const handleTaskNavigation=(id)=>{
    console.log(id)
    if(!id){
     toast.error("Please Provide id")
     return;
    }
    navigate(`${id}`)
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

  const handleEditTaskDialog=(e)=>{
    setShowEditTask(true);
    setAnchorEl(null);
     
  }

  console.log("filter task",filteredTask)

  const handleAssigneeMenu=(e)=>{
    console.log(e.target.value)
    setSelectAssignee(e.target.value);
    if(e.target.value !== ""){
      const result=tasks.filter((p)=>p.creator?.name.toLowerCase()===e.target.value.toLowerCase());
      return setFilteredTask(result)
    }
    setFilteredTask(tasks);


  }
  const handleProjectMenu=(e)=>{
    console.log(e.target.value)
    setSelectProject(e.target.value);
    if(e.target.value !== ""){
      const result=tasks.filter((p)=>p.projectId?.name.toLowerCase()===e.target.value.toLowerCase());
      return setFilteredTask(result)
    }
    setFilteredTask(tasks);

  }
  return (
    <div style={{width:"100%"}}>
    <Grid container spacing={2} sx={{ justifyContent: "center", marginTop: 2 }}>
      {statuses.map((status, index) => (
        <Grid item xs={12} sm={6} md={2.4} key={index}>
          <Card sx={{ textAlign: "center", boxShadow: 2, borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#F0F5FF",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  margin: "0 auto 8px",
                }}
              >
                <CalendarMonth color="primary" />
              </Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {status.label}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {status.count}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Update: July 14, 2023
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    {tasksLoading? <Skeleton />:(

    <Paper sx={{ padding: 2, borderRadius: 2 }}>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={3}>
          <Select displayEmpty fullWidth size="small" value={selectStatus} onChange={handleStatusMenu} >
            <MenuItem value="">All statuses</MenuItem>
            {Object.keys(statusColors).map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={3}>
          <Select displayEmpty fullWidth size="small"
            value={selectAssignee} onChange={handleAssigneeMenu}
          >
            <MenuItem value="">All assignees</MenuItem>
            {
              [...new Set(tasks.map((e)=>e.creator?.name))].map((e)=>{
                if(e===null) return;
                else{
                  return(
                    <MenuItem value={e}>{e}</MenuItem>
                  )
                }
              })
            }
          </Select>
        </Grid>
        <Grid item xs={3}>
          <Select displayEmpty fullWidth size="small"
             value={selectProject} onChange={handleProjectMenu}
          >
            <MenuItem value="">All projects</MenuItem>
            {[...new Set(tasks.map((e)=>e.projectId?.name))].map((project) =>(
              <MenuItem key={project} value={project}>{project}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={3}>
          <Button variant="contained" onClick={handleTask} >+ Task</Button>
        </Grid>
        {openTDialog && <AddNewTaskDialog open={openTDialog} closyDialog={setopenTDialog} />}
      </Grid>
      
     
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"><CheckBox /></TableCell>
              <TableCell >
                <TableSortLabel active={sortBy === "name"} direction={sortDirection} onClick={() => handleSort("name")}>
                  Task Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={sortBy === "project"} direction={sortDirection} onClick={() => handleSort("project")}>
                  Project
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={sortBy === "assignee"} direction={sortDirection} onClick={() => handleSort("assignee")}>
                  Created By
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={sortBy === "dueDate"} direction={sortDirection} onClick={() => handleSort("dueDate")}>
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell> 
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTask.map((task) => (
              <TableRow key={task._id} >
                <TableCell><Checkbox /></TableCell>
                <TableCell onClick={()=>handleTaskNavigation(task._id)} style={{cursor:"pointer"}}>{task.title}</TableCell>
                <TableCell>
                  {/* <Chip label={task.project.split(" ")[0]} color="primary" /> */}
                  <Typography variant="button" sx={{ marginLeft: 1 }}>{task.projectId?.name}</Typography>
                </TableCell>
                  {/* <Chip label={task.assignee.charAt(0)} variant="outlined" /> */}
                <TableCell>
                  <Typography  sx={{ marginLeft: 1 }}>{task.creator?.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: "black", fontWeight: "normal" }}>{task.dueDate}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={task.status} color={statusColors[task.status]} />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(event) => handleMenuOpen(event, task._id,task.projectId._id)}>
                    <MoreVert/>
                  </IconButton>
                  

                  {/* <EditTaskDialog open={showEditTask} editId={task._id} onClose={()=>setShowEditTask(false)} /> */}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedRow === task._id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEditTaskDialog}>Edit</MenuItem>
                    <MenuItem onClick={handleDeleteTaskDialog}>Delete</MenuItem>
                  </Menu>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Suspense fallback={<CircularProgress />} >
                    {showEditTask && <LazyEditDialog open={showEditTask} 
                        editId={selectedRow} onClose={()=>setShowEditTask(false)} 
                          proId={selectedTaskProjectId}
                        />}
      </Suspense>
      
      <Suspense fallback={<CircularProgress />}>
            {openDDialog && <LazyDeleteDialog 
            open={openDDialog} onClose={()=>setopenDDialog(false)} taskId={selectedRow}  />}
      </Suspense>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={tasks.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
        nextIconButtonProps={{ disabled: page >= Math.ceil(tasks.length / rowsPerPage) - 1 }}
        backIconButtonProps={{ disabled: page === 0 }}
      />
    </Paper>
    )}
    </div>
  );
};

export default WebLayout()(TaskManagement);
