import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Switch,
  IconButton,
  Autocomplete,
  Chip,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Flag } from "@mui/icons-material";
import { useAddTaskMutation, useGetMyProjectsQuery, useGetProjectMembersMutation } from "../../redux/api/api";
import axios from "axios";
import { useAsyncMutation } from "../Hooks/Hooks";

const AddNewTaskDialog = ({ open, closyDialog }) => {

  const {data:priojecty,isLoading:projectsLoading} =useGetMyProjectsQuery()
  const [members,setMembers]=useState([])

  const allProjects=useMemo(()=>{
    if(!projectsLoading){
      return priojecty.Projects
    }
    return []
  },[projectsLoading])
  console.log(allProjects)


console.log("varible fuc",members)
    const [teamStudents,setteamStudents]=useState([]);
    const [projectTitle, setProjectTitle] = useState("");
    const [piroA, setpiroA] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [reminder, setReminder] = useState("");
    const [dueDate, setDueDate] = useState("");

    const[getProjectMembers,projectMembersLoading,pd21]= useAsyncMutation(useGetProjectMembersMutation);
    
    const[addTheTask,taskLoading]=useAsyncMutation(useAddTaskMutation);

    useEffect(()=>{
      const fetchMembers = async () => {
        const response = await getProjectMembers("Getting The Members...", { piroA });
        console.log("kyuuuu bhaiiiii", response);
        setteamStudents(response?.members?.teamMembers || []);
      };
      if( open && piroA?.length>0){
        fetchMembers()
        }

    },[piroA]);
    
    const handleClose=()=>{
        closyDialog(false)
    }
    const handleCreateTask=async ()=>{
      const t={projectTitle,piroA,dueDate,assignees,reminder,}
      console.log(projectTitle,piroA,dueDate,assignees,reminder)
      await addTheTask("Adding the Task",t)
      closyDialog(false)
    }


  return (
    <Dialog open={open} onClose={handleClose}  maxWidth="md"
    PaperProps={{
      sx: {
        padding: "12px",
        width: "600px",
        maxWidth: "100%",
        height: "auto",
      },
    }}
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "Left", pb: 1, fontSize: "16px" }}>Assign New Task</DialogTitle>
      <DialogContent sx={{ padding: "32px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Project Title */}

        <div>
        <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Task Name</Typography>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          value={projectTitle}
          sx={{
            "& .MuiInputLabel-root": { fontSize: "15px" }, // Small label text
          }}
          onChange={(e) => setProjectTitle(e.target.value)}
          InputProps={{
            inputProps: { style: { fontSize: "12px", padding: "13 px" } },
          }}
        />


        </div>


        

      {/* Projects */}

          <div>
          <Typography sx={{ fontWeight: "bold", textAlign: "Left", fontSize: "12px" }}>Select Project</Typography>
          <FormControl fullWidth variant="outlined" size="small" >
    <Select
    value={piroA || ""}
    onChange={(event) => setpiroA(event.target.value)}
    disabled={projectsLoading}
    sx={{ fontSize: "16px" }} // Adjust font size if needed
    >
    {projectsLoading ? (
      <MenuItem disabled>
        <CircularProgress size={20} />
      </MenuItem>
    ) : (
      allProjects.map((project) => (
        <MenuItem key={project._id} value={project._id}>
          {project.name}
        </MenuItem>
      ))
      )}
    </Select>
    </FormControl> 


          </div>
         
          <div>
            <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Due Date</Typography>
            <TextField
          fullWidth
          size="small"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
            InputProps={{
            inputProps: { style: { fontSize: "12px", padding: "13 px" } },
          }}
        />            
          </div>

          
        {/* Assign Member */}
          <div>
            <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Select Members</Typography>
            <Autocomplete      
        size="small"
        multiple
        options={projectMembersLoading ? [{ name: "Loading...", _id: "loading" }]:teamStudents || []} // Use valid data source
        getOptionLabel={(option) => option.name} // Ensure proper display
        value={assignees.length>0 ? teamStudents?.filter(m => assignees.includes(m._id)) : []} // Correct filtering
        onChange={(event, newValue) => {
          if (!projectMembersLoading) {
            setAssignees(newValue.map((item) => item._id)); // Store only IDs
          }
        }} 
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip {...getTagProps({ index })} key={option._id}
              sx={{ fontSize: "12px" }} label={option.name} />
          ))
        }
        renderOption={(props, option) =>
          option._id === "loading" ? (
            <li {...props} key="loading">
              <CircularProgress size={20} sx={{ marginRight: 1 }} /> Loading...
            </li>
          ) : (
            <li {...props} key={option._id}>
              {option.name}
            </li>
          )
        }
        renderInput={(params) => (
          <TextField {...params} 
            sx={{ "& .MuiInputBase-root": { fontSize: "12px" }}}
          />
        )}
  
        fullWidth
      />
                 
          </div>


      
    <div>
      <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Attach File</Typography>
      <TextField fullWidth type="file" size="small" InputProps={{ sx: { fontSize: "12px", height: "34px" } }} />
    </div>
        
      <FormControl fullWidth variant="standard" sx={{ minWidth: 120 }} size="small">
              <InputLabel shrink >Set Reminder</InputLabel>
              <Select value={reminder} 
              onChange={(e) => setReminder(e.target.value)}
              displayEmpty
              sx={{
                fontSize: "14px",
                padding: "4px 10px",
                "& .MuiSelect-select": {
                  padding: "8px 12px",
                },
              }}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="1_hour">1 Hour Before</MenuItem>
                <MenuItem value="1_day">1 Day Before</MenuItem>
              </Select>
            </FormControl>
      
        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
          onClick={handleCreateTask}
          disabled={taskLoading}
        >
          Assign Task
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewTaskDialog;
