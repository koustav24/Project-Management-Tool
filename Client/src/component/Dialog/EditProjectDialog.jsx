import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
  Autocomplete,
  Chip,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { CalendarToday, Folder } from "@mui/icons-material";
import { useAddNewProjectMutation, useEditProjectMutation, useGetAllMembersQuery } from "../../redux/api/api";
import { useAsyncMutation } from "../Hooks/Hooks";


const EditProjectDialog = ({ open,projectName ,projectId,onClose }) => {

//   const {user}=useSelector((state)=>state.auth)
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [EditProject,isLoadingEditProject]=useAsyncMutation(useEditProjectMutation)
  const [value,setvalue]=useState('')
  const handleEditProject=async ()=>{
    const t={
      projectTitle,description,assignees,dueDate
    }
    console.log(projectTitle,description,assignees,dueDate)
   await EditProject("Editing THe Project",{id:projectId,edit:t})
   onClose()
  }

  const {data:getAllMembers,isLoading:yeda}=useGetAllMembersQuery()
  const members = getAllMembers?.members || []; 
  
  const handleCloseDialog=()=>{
    DialogHandler(false);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md"
    fullWidth
    PaperProps={{
      sx: {
        padding: "12px",
        width: "600px", // Rectangular Format
        maxWidth: "100%",
        height: "auto",
      },
    }}>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", pb: 1, fontSize: "16px" }}>Edit Project</DialogTitle>
      <DialogContent sx={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Project Title */}
        <FormControl fullWidth variant="standard">
            <InputLabel>Projects</InputLabel>
            <Select value={value} 
            onChange={(e)=>setvalue(e.target.value)}
            >
                <MenuItem value="projectName">{projectName}</MenuItem>
            </Select>
        </FormControl>
        
        
        
        <div>
        <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Project Name</Typography>
        <TextField
          fullWidth
          size="small"
          label="Project Title"
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
        size="small"
          fullWidth
          variant="outlined"
          margin="dense"
          sx={{
            "& .MuiInputLabel-root": { fontSize: "15px" }, // Small label text
          }}
          multiline
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          InputProps={{
            inputProps: { style: { fontSize: "12px", padding: "13 px" } },
          }}
        />
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
        <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Select Memmbers</Typography>
        <Autocomplete
          size="small"
          multiple
          options={members} // Use transformed data
          getOptionLabel={(option) => option.name} // Display name in dropdown
          value={members?.filter(m => assignees.includes(m._id))} // Show selected names
          onChange={(event, newValue) => setAssignees(newValue.map(item => item._id))} // Store only IDs
          renderTags={(selected, getTagProps) =>
        selected.map((option, index) => (
          <Chip
          {...getTagProps({ index })}
          key={option._id}
          sx={{ fontSize: "12px" }}
          label={option.name} // Show name in selected chips
        />
      ))
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label={yeda?"Please Wait...":"Select Members"}
        disabled={yeda}
        sx={{
          "& .MuiInputBase-root": { fontSize: "12px" }, // Small input text
        }}
      />
    )}
    fullWidth
  />
        </div>
        

      <TextField
        fullWidth
        type="file"
        size="small"
        InputProps={{
          inputProps: { style: { fontSize: "12px", padding: "15 px" } },
        }}
      />

      {/* <FormControl fullWidth variant="standard" sx={{ minWidth: 120 }} size="small">
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
      </FormControl> */}

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
          onClick={handleEditProject}
          disabled={isLoadingEditProject}
        >
          Edit Project
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
