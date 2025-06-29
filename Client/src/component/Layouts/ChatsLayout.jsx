import { Grid, Skeleton } from "@mui/material";
import { useGetMyGroupsQuery } from "../../redux/api/api";
import ChatList from "../Shared/ChatList";

const ChatsLayout=()=>(WrappedComponent)=>{
    return(props)=>{
      
      const {data:getMyGroups,isLoading:groupsLoading}=useGetMyGroupsQuery()
      console.log("communication",getMyGroups)

      return(
        <>
        
        <Grid container height={"100%"} sx={{backgroundColor:"red"}}>
        
        <Grid item xs={0} sm={4} sx={{backgroundColor:"white",p:1,display:{xs:"none",sm:"block"}}}>
          {groupsLoading ? (
            <Skeleton height={"100%"} />
          ):(
            <>
            {/* <div>Chats Layout</div> */}
            <ChatList chats={getMyGroups.gChats} chatId={getMyGroups.gChats._id}/>
            </>
          )}
          
          
        </Grid>
        <Grid item xs={12} sm={8} sx={{backgroundColor:"White"}}> <WrappedComponent {...props} /> </Grid>


        
        </Grid>


        
        </> 
      )
    }  
  }
  
export default ChatsLayout;
  