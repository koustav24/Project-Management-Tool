import { FileCopy } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { fileFormat } from "../utility/features";
import RenderingAttachments from "./RenderingAttachments";

const MessageComponent=({message,user})=>{
    const {sender,content,attachments=[]}=message;

    const sameSender=sender._id===user._id;
    

    return(
        <div 
        style={{
            alignSelf:sameSender?"flex-end":"flex-start",
            backgroundColor:sameSender?"#007AFF":"#e0dcdc ",
            color: sameSender?"#FFFFFF":"#333333",
            borderRadius:"12px",
            padding:"0.7rem",
            maxWidth:"60%",
            margin:"3px",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
            wordWrap:"break-word"
        }}
        >
            { !sameSender && <Typography variant="button" color="rgb(14, 111, 255)"  fontWeight={"bold"}>{sender.name}</Typography>}

            { content && <Typography variant="body2">{content}</Typography>}

            {attachments.length > 0 && attachments.map((attachmnt,index)=>{
                const url=attachmnt.url;
                const file=fileFormat(url)
                console.log("extension",file)
                
                return(
                    <Box key={index} sx={{padding:0}} >
                        <a href={url} target="_blank" download  > <RenderingAttachments file={file} url={url} /> </a>
                    </Box>
                )
            })}

        </div>
    )
}

export default MessageComponent;