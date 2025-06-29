import { Image as ImageIcon,MusicNote as MusicNoteIcon,VideoCall as VideoCallIcon,FileCopy as FileIcon } from "@mui/icons-material"
import { Menu, MenuItem, MenuList } from "@mui/material"
import { useRef } from "react"
import toast from 'react-hot-toast'
import axios from 'axios'

const FileMenuDialog=({anchorEl,chatId,onClose})=>{

  const imageRef=useRef(null);
  const audioRef=useRef(null);
  const videoRef=useRef(null);
  const fileRef=useRef(null);

  const selectRef=(ref)=>{
    ref.current?.click();
}

  const fileChangeHandler=async(e,key)=>{
    const files=Array.from(e.target.files);
    if(files.length<=0) return;
    const toastId=toast.loading(`Sending ${key}...`)
    try {
      const formData=new FormData();
      formData.append("chatId",chatId);
      files.forEach((file)=>formData.append('AttachFiles',file));

      const res=await axios.post('http://localhost:3000/chats/message',formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        },
        withCredentials:true
      })
      if(res.data) toast.success(`${key} are uploaded succesfully`,{id:toastId})
      else toast.error(`Images are not Uploaded`,{id:toastId})
    } catch (error) {
      toast.error(error,{id:toastId})
      console.log("error kyaa",error)
    }
  }


  return(
    <Menu anchorEl={anchorEl} open={true} onClose={onClose}
    anchorOrigin={{
      vertical: "top", // Adjusts where the menu appears relative to anchor
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "bottom", // Moves the menu slightly upwards
      horizontal: "center",
    }}
    

    >
      <MenuList sx={{width:"9rem"}}>
        <MenuItem onClick={()=>selectRef(imageRef)}> 
          <ImageIcon /> Images
          <input type="file" multiple accept="image/png, image/jpg, image/jpeg"
            style={{display:"none"}} 
            onChange={(e)=>fileChangeHandler(e,'image')}
            ref={imageRef}
          />
        </MenuItem>

        <MenuItem onClick={()=>selectRef(audioRef)}>
          <MusicNoteIcon /> Audio
          <input type="file" multiple accept="audio/mpeg, audio/wav"
            style={{display:"none"}} 
            onChange={(e)=>fileChangeHandler(e,'Audio')}
            ref={audioRef}
          />
        </MenuItem>

        <MenuItem onClick={()=>selectRef(videoRef)}>
          <VideoCallIcon /> Video
          <input type="file" multiple accept="video/mp4, video/webm, video/ogg ,video/x-flv"
            style={{display:"none"}} 
            onChange={(e)=>fileChangeHandler(e,'Video')}
            ref={videoRef}
          />
        </MenuItem>

        <MenuItem onClick={()=>selectRef(fileRef)}>
          <FileIcon /> File
          <input type="file" multiple accept="*"
            style={{display:"none"}} 
            onChange={(e)=>fileChangeHandler(e,'File')}
            ref={fileRef}
          />
        </MenuItem>

      </MenuList>
    </Menu>
  )
}

export default FileMenuDialog