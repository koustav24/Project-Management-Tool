import { Divider, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import ChatItem from "./ChatItem";

const ChatList=({
  w="100%",
  chats=[],
  })=>{

    const dispatch=useDispatch();


  return(
    <Stack width={w} direction={'column'} sx={{bgcolor:'rgb(255, 255, 255)',}}   height={"100%"}>
      <Divider ><Typography variant="h5" component={"h3"}>Groups</Typography></Divider>
      {
        
        chats?.map((data,index)=>{
          const {name,_id,members}=data
          return <ChatItem name={name} _id={_id} key={_id} />
        })
        
      }
    </Stack>
  )
}

export default ChatList;