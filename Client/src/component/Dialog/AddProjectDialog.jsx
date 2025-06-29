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
  Typography,
  Grid,
} from "@mui/material";
import { useAddNewProjectMutation, useGetAllMembersQuery } from "../../redux/api/api";
import { useAsyncMutation } from "../Hooks/Hooks";
import { useSelector } from "react-redux";

const AddProjectDialog = ({ open, DialogHandler }) => {
  const { user } = useSelector((state) => state.auth);
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [reminder, setReminder] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [files, setFiles] = useState(null);

  const [AddNewProject, isLoadingAddNewProject] = useAsyncMutation(useAddNewProjectMutation);

  const handleAddProject = async () => {
    const formData=new FormData();
    formData.append("projectTitle",projectTitle);
    formData.append("description", description);
    formData.append("dueDate", dueDate);
    formData.append("creator", user._id);

    assignees.forEach((assignee, index) => {
      formData.append(`assignees[${index}]`, assignee); // Send assignees as an array
  });
    if(files){
    files.forEach((file)=>{
      formData.append("file",file)
    })
  }

    const projectData = { projectTitle, description, assignees, dueDate, creator: user._id };
    AddNewProject("Creating The Project", formData);
    handleCloseDialog()
  };

  const { data, isLoading: loadingMembers } = useGetAllMembersQuery();
  const members = useMemo(() => (!loadingMembers ? data.members : []), [loadingMembers]);

  const handleFileChange=(e)=>{
    setFiles(Array.from(e.target.files));
    console.log("selcected Files",Array.from(e.target.files));
  }

  const handleCloseDialog = () => {
    DialogHandler(false);
  };
  const handleClear=()=>{
    setProjectTitle("");
    setDescription("");
    setAssignees([]);
    setDueDate("")
    setReminder("")
  }

  return (
    <Dialog
  open={open}
  onClose={handleCloseDialog}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      padding: "12px",
      width: "600px", // Rectangular Format
      maxWidth: "100%",
      height: "auto",
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: "bold",
      fontSize: "16px",
      textAlign: "center",
      paddingBottom: "8px",
    }}
  >
    Create Project
  </DialogTitle>

  <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px" }}>
    {/* Project Title */}
    <div>
      <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Project Name</Typography>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        value={projectTitle}
        onChange={(e) => setProjectTitle(e.target.value)}
        InputProps={{ sx: { fontSize: "12px", height: "34px" } }}
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

    {/* Set Reminder */}
    <div>
      <Typography sx={{ fontWeight: "bold", fontSize: "12px"}}>Set Reminder</Typography>
      <FormControl sx={{width:"50%"}} variant="outlined" size="small">
        <Select
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          displayEmpty
          sx={{ fontSize: "12px", height: "34px" }}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="1_hour">1 Hour Before</MenuItem>
          <MenuItem value="1_day">1 Day Before</MenuItem>
        </Select>
      </FormControl>
    </div>


    {/* Due Date */}
    <div>
      <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Due Date</Typography>
      <TextField
        fullWidth
        size="small"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        InputProps={{ sx: { fontSize: "12px", height: "34px" } }}
      />
    </div>
    

    {/* Assignees */}
    <div>
      <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Select Members</Typography>
      <Autocomplete
        size="small"
        multiple
        options={members}
        getOptionLabel={(option) => option.name}
        value={members?.filter((m) => assignees.includes(m._id))}
        onChange={(event, newValue) => setAssignees(newValue.map((item) => item._id))}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option._id}
              sx={{ fontSize: "10px", height: "24px" }}
              label={option.name}
            />
          ))
        }
        renderInput={(params) => <TextField {...params} fullWidth />}
        sx={{ fontSize: "12px" }}
      />
    </div>

    {/* Attach File */}
    <div>
      <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>Attach File</Typography>
      <TextField fullWidth type="file" 
       size="small"
        InputProps={{ 
          sx: { fontSize: "12px", height: "34px" },
          inputProps:{
            multiple:true
          } 
          }}
          onChange={handleFileChange}
          />
    </div>
        


  </DialogContent>

  {/* Buttons */}
  <div
    style={{ display: "flex", justifyContent: "flex-end", gap: "8px", padding: "12px", marginTop: "-10px" }}
  >
    <Button
      variant="outlined"
      color="error"
      onClick={handleCloseDialog}
      sx={{ fontSize: "12px", padding: "4px 12px" }}
    >
      Cancel
    </Button>
    <Button
      variant="outlined"
      color="error"
      onClick={handleClear}
      sx={{ fontSize: "12px", padding: "4px 12px" }}
    >
      Clear
    </Button>


    <Button
      variant="contained"
      color="primary"
      onClick={handleAddProject}
      disabled={isLoadingAddNewProject}
      sx={{ fontSize: "12px", padding: "4px 12px" }}
    >
      Create
    </Button>
  </div>
</Dialog>
  );
};

export default AddProjectDialog;
