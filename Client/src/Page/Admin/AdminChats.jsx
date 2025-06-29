import { Grid, IconButton, Stack } from "@mui/material"
import { AttachFile as AttachIcon, Send as SendIcon} from "@mui/icons-material"
import { useParams } from "react-router-dom"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import ChatsLayouAdmin from "../../component/Layouts/ChatsLayouAdmin"
import AdminLayout from "../../component/Layouts/AdminLayout"
import { useGetOldMsgsQuery, useGetSpecificChatDetailsQuery } from "../../redux/api/api"
import { getSocket } from "../../Socket"
import { useSocketEvents } from "../../component/Hooks/Hooks"
import MessageComponent from "../../component/Shared/MessageCompnent"
import FileMenuDialog from "../../component/Dialog/FileMenuDialog"
import { InputBox } from "../../component/Styled/StyledComponents"

const AdminChats=()=>{
  const params=useParams();
  const chatId=params.id;
  const socket=getSocket();
  console.log("socket",socket.id)
  const {user}=useSelector((state)=>state.auth)

  console.log('user',user)
  const {data:oldMsgChuck,isLoading:oldMsgLoading} = useGetOldMsgsQuery({chatId});
  const {data:specificChatDetails,isLoading:specificChatLoading} = useGetSpecificChatDetailsQuery({chatId});
  
  const [upComingMsgs,setupComingMsgs]=useState([])
 
  const members=specificChatDetails?.members
  // if(!specificChatLoading){
  //   console.log("Specific",specificChatDetails,members)
  // }
  const [inputMsg,setInputMsg]=useState("")
  const [isFileMenu,setIsFileMenu]=useState(false);
  const [isFileMenuAnchor,setIsFileMenuAnchor]=useState(null);

  const fileMenuHandler=(e)=>{
    setIsFileMenu(true)
    setIsFileMenuAnchor(e.currentTarget)
  }

  const msgOnChangeHandler=(e)=>{
    setInputMsg(e.target.value)
  }
  const submitHandler=(e)=>{
    e.preventDefault();
    socket.emit("NEW_MSG",{chatId,members,message:inputMsg})
    console.log('Sent Message',inputMsg);
    setInputMsg('');
  }

  console.log('connection',socket.connected)
  
  const newMsgHandler=useCallback((data)=>{
    if(data.chatId !== chatId) return;
    setupComingMsgs((p)=>[...p,data.msg])
    console.log("Recieved",data.chatId);
    console.log("handler")
  },[])
  
  let rt=[]
  if(!oldMsgLoading){
    rt=[...oldMsgChuck?.msg,...upComingMsgs]
  }

  const SocketEventArr=useMemo(()=>({
    "NEW_MSG":newMsgHandler
  }),[newMsgHandler])

  useSocketEvents(socket,SocketEventArr);

  console.log("AllMsgs",rt)

  if(!oldMsgLoading) console.log("OLD mESAGE",oldMsgChuck)

    return(

      <Grid container height="100%" direction="column" wrap="nowrap" >
        {/* Message Section (Scrollable) */}
      <Grid item xs style={{ overflowY: "auto", padding: "10px" }}>
      <Stack>
      {rt.map((i, index) => {
        console.log("ghero ghero solo",i)
        return(
        <MessageComponent key={`infData-${index}`} message={i} user={user} />
      )})}
      </Stack>
      </Grid>  

  {/* Input Section (Fixed at Bottom) */}
  <Grid item>
    <form onSubmit={submitHandler} style={{ width: "100%" }}>
      <Stack direction="row" alignItems="center" height="50px" bgcolor="white" sx={{ borderTop: "1px solid #ddd", padding: "5px" }}>
        <IconButton onClick={fileMenuHandler}>
          <AttachIcon />
        </IconButton>

        {isFileMenu && <FileMenuDialog anchorEl={isFileMenuAnchor} chatId={chatId} onClose={() => setIsFileMenu(false)} />}

        <InputBox placeholder="Type Message" value={inputMsg} onChange={msgOnChangeHandler} sx={{ flex: 1 }} />

        <IconButton type="submit">
          <SendIcon color="secondary" />
        </IconButton>
      </Stack>
    </form>
  </Grid>


      </Grid>



      // sadjsdnlasdnasd sidajsdiasd
      // <Stack height={"100%"} width={"100%"}  >
      //   <Stack flex={1} overflow={"auto"} sx={{ padding: "10px" }}>
      // {/* <Stack bgcolor={"rgb(255, 255, 255)"} height={"90vh"} width={"100%"} sx={{overflowY:"auto"}} > */}
      // {
      //  rt.map((i,index)=>(
      //   <MessageComponent 
      //   key={`infData-${index}`}
      //   message={i}
      //   user={user}
        
      //   />
      //  ))

      // } 
        
      
      // </Stack>  

      // <form onSubmit={submitHandler} style={{width:"100%"}} >
      //   <Stack direction={'row'} alignItems={'center'} height={"50px"} bgcolor={"white"}>

      //   <IconButton onClick={fileMenuHandler} >
      //     <AttachIcon />
      //   </IconButton>

      //   {isFileMenu && <FileMenuDialog anchorEl={isFileMenuAnchor} chatId={chatId} onClose={()=>setIsFileMenu(false)} />}

      //   <InputBox placeholder="Type Message" value={inputMsg} onChange={msgOnChangeHandler} sx={{flex:1}} />

      //   <IconButton type="submit" >
      //     <SendIcon 
      //     // sx={{color:"red"}}
      //      color="secondary" />
      //   </IconButton>

      //   </Stack>
      // </form>
        
      // </Stack>
    )
}

const enhancedChat=ChatsLayouAdmin()(AdminChats)
export default AdminLayout()(enhancedChat);