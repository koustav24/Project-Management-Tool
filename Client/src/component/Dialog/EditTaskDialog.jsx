import {
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useEditTaskMutation, useGetMyProjectsQuery, useGetMyTaskDetailsQuery, useGetProjectMembersMutation } from "../../redux/api/api";
import { useAsyncMutation } from "../Hooks/Hooks";
import { LayoutLoader } from "../Layouts/Loader";

const EditTaskDialog = ({ open, onClose,editId,proId }) => {

  const {data:MyTasks,isLoading:MyTaskDataLoading}=useGetMyTaskDetailsQuery(editId);
  console.log("Dialog edit",MyTasks)
  const[getProjectMembers,projectMembersLoading]=useAsyncMutation(useGetProjectMembersMutation);
    
  const [members,setMembers]=useState([])

    console.log("varible fuc",members)
    const [teamStudents,setteamStudents]=useState([]);
    const [projectTitle, setProjectTitle] = useState(MyTasks?.tusky?.title);
    const [description, setDescription] = useState("");
    const [piroA, setpiroA] = useState("");
    const [assignees, setAssignees] = useState([]);
    const [reminder, setReminder] = useState("");
    const [dueDate, setDueDate] = useState(MyTasks?.deadline);

    useEffect(() => {
      if (MyTasks) {
        setProjectTitle(MyTasks?.tusky?.title || "");
        setDescription(MyTasks?.tusky?.description || "");
        setpiroA(MyTasks?.projectId?._id || "");
        setDueDate(MyTasks?.deadline || "");
      }
    }, [MyTasks]);

    const[editTask,editTaskLoading]=useAsyncMutation(useEditTaskMutation);

  useEffect(()=>{
      console.log("Ohh biradar",piroA)
      const fetchMembers = async () => {
        try {
          const response = await getProjectMembers("Getting The Members...", { piroA:proId });
          console.log("Response from getProjectMembers:", response);
          if (response?.members?.teamMembers) {
            setteamStudents(response.members.teamMembers);
          }
        } catch (error) {
          console.error("Error fetching project members:", error);
        }
      };

      fetchMembers()
    },[]);
    
    const handleEditTask=()=>{
      const t={projectTitle,piroA:proId,dueDate,assignees,reminder}
      console.log("piiiiiiiiirooooo",proId)
      editTask("Adding the Task",{ id: editId, edit: t })
    }

    console.log("teammsmsdsdas",teamStudents)
    console.log("Kiti velaa",projectTitle);
    

  return MyTaskDataLoading ?  <Skeleton /> :(
    <Dialog open={open} onClose={onClose}  maxWidth="md" fullWidth
    PaperProps={{
      sx: {
        padding: "12px",
        width: "600px",
        maxWidth: "100%",
        height: "auto",
      },
    }}>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", pb: 1, fontSize: "16px" }}>Edit Task</DialogTitle>
      <DialogContent sx={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Project t  */}
         {/* Project Title */}
          <FormControl fullWidth variant="standard">
            <InputLabel>Project</InputLabel>
            <Select value={piroA || ""} onChange={(e) => setpiroA(e.target.value)}>
              {MyTasks?.projectId && (
                <MenuItem value={MyTasks.projectId._id}>{MyTasks.projectId.name}</MenuItem>
              )}
          </Select>
          </FormControl>
        
        
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
        
        {/* Description */}
        <div>
              <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Description</Typography>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                InputProps={{ sx: { fontSize: "12px", padding: "6px" } }}
              />
            </div>
        
        

      {/* Project */}
      {/* <div>
        <Typography>Select Project</Typography>
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

      </div> */}
    
         
        {/* Due Date */}
          <div>
          <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Due Date</Typography>
          <TextField
          fullWidth
          size="small"
          type="date"
          sx={{width:"50%"}}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
            InputProps={{
            inputProps: { style: { fontSize: "12px", padding: "13 px" } },
          }}
          />
        </div>

        {/* Select Member */}
        <div>
           <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Select Members</Typography>
           <Autocomplete      
          size="small"
          multiple
          options={teamStudents || []} // Use valid data source
          getOptionLabel={(option) => option.name} // Ensure proper display
          value={teamStudents?.filter(m => assignees?.includes(m._id)) || []}
          // value={(teamStudents || []).filter(m => assignees.includes(m._id))} // Correct filtering
          onChange={(event, newValue) => setAssignees(newValue.map(item => item._id))} // Store only IDs
          renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip {...getTagProps({ index })} key={option._id}
              sx={{ fontSize: "12px" }} label={option.name} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Select Assignee"
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
          onClick={handleEditTask}
          disabled={editTaskLoading}
        >
          Edit Task
        </Button>
      </DialogContent>
    </Dialog>
  
  );
};

export default EditTaskDialog;
