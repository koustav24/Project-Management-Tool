import { FileOpen } from "@mui/icons-material"

const RenderingAttachments=({file,url})=>{
   
    switch(file){
        case "video":
            return <video src={url} preload="none" width={"200px"} controls />
        
        case "image":
            return(
                <img 
                src={url}
                width={"200px"}
                height={"150px"}
                style={{
                    objectFit: "contain",
                }}
                />
            )
        case "audio":
            return <audio src={url} preload="none" controls />
        
        default:
            return <FileOpen />
    }

}

export default RenderingAttachments;