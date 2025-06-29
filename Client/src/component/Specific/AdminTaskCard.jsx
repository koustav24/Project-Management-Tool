import { Close, CloudUpload, CloudUploadOutlined, Delete, Folder } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, Checkbox, Chip, Divider, FormControlLabel, Grid, IconButton, LinearProgress, Paper, Skeleton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import axios from 'axios';
import React, { lazy, useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useParams } from "react-router-dom";
import { useGetMyTaskDetailsQuery, useGetSubmittedTaskQuery, useGetTasksCommentQuery } from "../../redux/api/api";
import WebLayout from "../Layouts/WebLayout";
import { timeAgo } from "../utility/features";
import AdminLayout from "../Layouts/AdminLayout";

const LazyDeleteTaskDialog=lazy(()=> import('../Dialog/AdminDeleteTaskDialog'));

const AdminTaskCard = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sending,setSending]=useState(false);
  const [comments,setComments]=useState("")
  const params=useParams();
  const taskId=params.id;
  const [checked, setChecked] = useState(false);
  const [openDeleteDialog,setopenDeleteDialog]=useState(false);

  const {data,isLoading,refetch}=useGetSubmittedTaskQuery({taskId});
  const {data:commentData,isLoading:commentLoading,refetch:commentRefetch}=useGetTasksCommentQuery({id:taskId});
  const {data:TaskQuery,isLoading:loadingTaskQuery}=useGetMyTaskDetailsQuery(taskId);
  
  console.log("COmmmmon 1try",commentData);

  console.log("cmthgds",data)


    const handleChange = async(event) => {
      const newChecked=event.target.checked;
      setChecked(event.target.checked);
      const projectId=TaskQuery?.tusky?.projectId?._id;
      try {
    const response = await axios.put(
      `http://localhost:3000/admin/task/status`,
      { archy: newChecked ? "Completed" : "In Progress",taskId,projectId},
      { withCredentials: true }
    );

    console.log("Status updated successfully:", response.data);
  } catch (error) {
    console.error("Error updating status:", error.response?.data || error.message);
  }
    };

  useEffect(()=>{
    if(TaskQuery){
      const t=TaskQuery.tusky.status ==="In Progress"? false :true;
      setChecked(t)
    }
  },[TaskQuery])

  const [selectedFiles, setSelectedFiles] = useState([]); // Stores selected files
  const [uploadProgress, setUploadProgress] = useState({}); // Tracks upload progress
  const [checkFiles,setCheckFiles]=useState([])


if(loadingTaskQuery){
    return(
        <div>
          <Skeleton variant="text" width={200} height={"100%"} />
          <Skeleton variant="rectangular" width={300} height={"100%"} />
          <Skeleton variant="text" width={150} height={20} />
          
        </div>
    );
}
let dd=new Date()
if(!loadingTaskQuery){
    dd=new Date(TaskQuery.tusky.deadline).toLocaleDateString('en-IN').replace(/\//g, "-")
}

const handleDelete=async(taskId,id)=>{
  console.log(id);
  setUploading(true);
  const toastId=toast.loading("Deleting The File...")

  try {
    const res=await axios.post('http://localhost:3000/admin/file/delete',{ taskId, public_id:id },{
      withCredentials:true
      ,headers: {
        "Content-Type": "application/json", //
      },
      // data: { taskId, public_id:id }, // 
    })
    console.log(res);
    toast.success(res?.data?.msg,{id:toastId});
  } catch (error) {
    console.error("Error deleting file:", error);
    toast.error(error?.response?.data?.message,{id:toastId});
  }finally{
    setUploading(false)
  }
}

const handleFileSelection = (event) => {
  const files = Array.from(event.target.files);
  setSelectedFiles((pr)=>[...pr,...files]);
};
console.log("totalFiles:", data?.submittedTask?.totalFiles);


const handleUpload = async () => {
  if (selectedFiles.length === 0) return;
  setUploading(true);
  setSending(true);
  const toastId=toast.loading("Sending The Files");

  await Promise.all(
    selectedFiles.map(async(file)=>{
      const formData=new FormData();
      formData.append('taskId', taskId);
      formData.append("file",file);
     try {
      const res=await axios.post("http://localhost:3000/task/submit",formData,{
        withCredentials:true,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progress,
          }));
        },
      })
      console.log(res)
      toast.success(res?.data?.msg,{id:toastId})
      setUploadedFiles((prev) => [...prev, { name: file.name, url: res.data.url }]);
     } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong",{id:toastId})
      console.error("Upload error:", error);
     } 

    })
  );
  setSelectedFiles([]);
  setUploading(false);
  setSending(false)
  refetch();
};

const handleDeleteTask=async()=>{
  setopenDeleteDialog(true);  
}

const removeSelectedFile = (index) => {
  setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
};

const handlePostComment=async()=>{
  console.log(taskId);
  console.log("commenty",comments)
  try {
    setSending(true)
    const {data}=await axios.post('http://localhost:3000/comments/new',{taskId,body:comments},{
      withCredentials:true,
      headers:{
        "Content-Type":"application/json"
      }
    })
    toast.success(data?.msg)
  } catch (error) {
    console.log(error)
    toast.error(error?.response?.data?.message || "Something went Wrong")
  }finally{
    setSending(false);
    setComments("")
    commentRefetch()
  }
}

const handleDownload = (h) => {
  const fileUrl = URL.createObjectURL(h); // Convert Blob to URL
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = "filename.ext"; // Set desired filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(fileUrl); // Clean up memory
};

const handleDragOver=(e)=>{
  e.preventDefault();
  console.log("drag")
}

const handleDrop=(e)=>{
  e.preventDefault()
  e.stopPropagation();
  console.log("dropped");
  const droppedFiles=Array.from(e.dataTransfer.files);
  setSelectedFiles((pr)=>[...pr,...droppedFiles])
  setCheckFiles((p)=>[...p,droppedFiles]);
  console.log("All Files",checkFiles)
}
console.log(TaskQuery)

  return (

    <div style={{ padding: 20,width:"100%" }}>
      
      { openDeleteDialog && <LazyDeleteTaskDialog open={openDeleteDialog}
        onClose={()=> setopenDeleteDialog(false)} taskId={taskId} /> 
      }
      {/* <Typography variant="h5" fontWeight="bold" gutterBottom>
        Task: {TaskQuery.tusky.title}
      </Typography> */}

    <Card sx={{ boxShadow: 0, padding: 0,marginTop:1}}>
      <CardContent >
        <Grid container justifyContent="space-between" alignItems="center">
          {/* Left Side: Task Title */}
          <Grid item>
            <Typography variant="h6" fontWeight="bold">
              Task
              <Chip label={TaskQuery.tusky.status}
               color={TaskQuery.tusky.status === 'Completed'?"primary": "error"} variant="outlined" sx={{mx:1}}></Chip>
            </Typography>
          </Grid>

          {/* Right Side: Deadline */}
          <Grid item sx={{display:'flex',flexDirection:"row",alignItems:"center"}}>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleChange} />}
            label="Completed"
          />
          <Tooltip title="Delete">
          <Button variant="outlined" color="error" onClick={handleDeleteTask} ><Delete /></Button>
          </Tooltip>
          
          
          <Typography variant="h5" fontWeight="bold">
            <Chip size="medium" label={`Deadline:${dd}`} color="error" variant="outlined" sx={{mx:1}} />
           </Typography>
          </Grid>
        </Grid>

        {/* Task Description */}
        <Typography variant="body1" mt={2} >
            {TaskQuery.tusky.title}
        </Typography>
      </CardContent>
    </Card>

        {/*Description  */}
      <Card sx={{ borderRadius: 2,boxShadow:0 }} xs={12}>
      <CardContent>
        <Grid container spacing={1} direction="column">

          <Grid item>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Description
            </Typography>
          </Grid>
          <Grid item>
            <Stack >
            <Typography variant="body2" color="textSecondary" sx={{mt:2}}>
                { "No description available sdnals das dlasd asdb asd asdkla sd"}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
        {/* Task Upload */}
    <Card sx={{ borderRadius: 2,mt:1,boxShadow:0,border:"0.4px dotted grey" }} xs={12} elevation={8}>
      <CardContent>
        <Grid container spacing={1} direction="column">
          {/* Header */}
          <Grid item>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Task Submission
            </Typography>
          <div
            style={{
            width: "100%",
            height: "200px",
            border: "2px dashed #aaa",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            cursor: "pointer",
            margin: "20px auto",
            backgroundColor: "#f9f9f9",
            flexDirection:'column'
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          >
            <CloudUploadOutlined  fontSize="large"/>
            <p>Drag & Drop files here</p>
          </div>
            
          </Grid>

          <Grid item xs={12} sx={{ display: "flex",flexDirection:'column', justifyContent: "center", alignItems: "center" }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUpload />}
              sx={{
                width:"50%",
                backgroundColor: "rgb(41, 114, 223)",
                color: "#fff",
                "&:hover": { backgroundColor: "#1565C0" },
                padding: "5px",
                fontSize: "10px",
              }}
              disabled={sending}
            >
              Upload Files
              <input
                type="file"
                multiple
                hidden
                onChange={handleFileSelection}
              />
            </Button>

              {/* Show Selected Files */}
      {!uploading && selectedFiles.length > 0 && (
        <Stack sx={{ padding: 2, margin: 2,width:"80%"}}>
          <Divider variant="middle"><Typography variant="h6" fontFamily={"Figtree"}>Selected Files</Typography></Divider>
          
          {selectedFiles.map((file, index) => (
            <Stack key={index} direction="row" alignItems="center" justifyContent={"center"} spacing={1} sx={{ mt: 1 }}>
            <Typography variant="body2" >{file.name}</Typography>
            <Button size="small" color="error" onClick={() => removeSelectedFile(index)}>
              <Close />
            </Button>
          </Stack>
          ))}
          <Button variant="contained" color="primary" onClick={handleUpload} sx={{ mt: 2 }}>
            Upload Files
          </Button>
        </Stack>
      )}

      {/* Show Upload Progress */}
      {Object.keys(uploadProgress).map((fileName) => (
        <Paper key={fileName} sx={{ padding: 2, margin: 1 }}>
          <Typography variant="body2">{fileName}</Typography>
          <LinearProgress variant="determinate" value={uploadProgress[fileName]} />
        </Paper>
      ))}


            {/* Show Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div>
          <Typography variant="h6">Uploaded Files</Typography>
          {uploadedFiles.map((file, index) => (
            <Typography key={index} variant="body2">
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            </Typography>
          ))}
        </div>
      )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
      {/* Task Submitted */}
    <Card sx={{ borderRadius: 2,mt:1,boxShadow:0 }} xs={12} elevation={8}>
        <CardContent>
            <Grid container spacing={1} direction="column">
                <Grid item >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Task Submitted
                    </Typography>
                </Grid>
                {isLoading || data?.submittedTask?.totalFiles===0 ?(
                  <Typography sx={{mt:2,mx:1}}>No Task submitted till now</Typography>)
                  :(
                  <Grid>
                  {data.submittedTask.map((h,index)=>{
                      return(
                    <Paper
                    variant="outlined"
                    key={index}
                    sx={{
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "#f5f5f5",
                      m:1,
                      cursor:"pointer",
                      display:"flex",
                      justifyContent:"space-between"

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
                     <Folder /> FIles
                    </a>
                  </Typography>
                    <IconButton onClick={()=>handleDelete(taskId,h.public_id)}>
                      <Close color="error" />
                    </IconButton>

                </Paper>
                      )
                  })}
                  </Grid>
                )}
            </Grid>
        </CardContent>

    </Card>

    <Card sx={{ borderRadius: 2 }} elevation={3} xs={12}>
      <CardContent>
        <Grid container spacing={1} direction="column">

          <Grid item>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Discussions
            </Typography>
          </Grid>
          <Grid item display={'flex'} flexDirection={'column'}>
          {/* <Box sx={{px:2,border:"1px solid grey"}}> */}
            <Stack direction={'row'} gap={0.3}>
            <Avatar
              alt="User"
              src="https://i.pravatar.cc/40" // Placeholder avatar
              sx={{
                width: 32,
                height: 32,
                marginRight: 1,
                "@media (max-width: 600px)": {
                  width: 28,
                  height: 28,
                },
              }}
            />      
            <TextField
            fullWidth
            // variant="standard"
            value={comments}
            onChange={(e)=>setComments(e.target.value)}
            placeholder="Write a Comment"
            InputProps={{
              disableUnderline: true,
            }}
            />  
            </Stack>
            <div style={{alignSelf:"flex-end",marginTop:'0.5rem',marginBottom:"0.5rem"}} >
              <Button variant="contained" sx={{borderRadius:"8px"}} 
              onClick={handlePostComment} disabled={sending}
              >
              Comment
              </Button>
            </div>
            {commentData?.comments.length >0 && 
            commentData?.comments.map((t,index)=>{
              const ta=timeAgo(t.updatedAt)
              return(
              <Stack direction={'row'} gap={2} padding={1} key={`sda${index}`}>
                <Avatar src={t.creator.profilePic} />
                <Card sx={{ borderRadius: 2, boxShadow: 0,border:"1px solid rgb(177, 177, 177)", p: 1, width: "100%"}}>
                <Stack direction={"column"} px={1}>
                  <Box display={"flex"} gap={4}>
                  <Typography fontWeight={'bold'} >{t.creator.name}</Typography>
                  <Typography color="textDisabled" variant="caption" fontWeight={"bold"} >{ta}</Typography>
                  </Box>
                  
                  
                  <Typography fontSize={"14px"} color="rgb(68, 66, 66)" sx={{}} >{t.body}</Typography>
                </Stack>
                </Card>
              </Stack>
            )})
            }
          
          </Grid>
        </Grid>
      </CardContent>
    </Card>


    </div>
  );

};

export default AdminLayout()(AdminTaskCard);
