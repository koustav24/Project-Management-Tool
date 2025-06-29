import { Dialog, DialogContent, DialogTitle, Popover, Skeleton, Stack, Typography } from "@mui/material"
import { useGetMyNotificationsQuery } from "../../redux/api/api"
import { useDispatch } from "react-redux";
import UserNotifyItem from "../Shared/UserNotifyItem";
import { resetNotifications } from "../../redux/reducers/project";


const Notifications=({open,id,anchorEl, onClose})=>{
  const dispatch=useDispatch();
  const {data,isLoading}=useGetMyNotificationsQuery();
  console.log("hydra",data)
  const handleOnClose=()=>{
    dispatch(resetNotifications())
    onClose()
  }
  return(
    <Stack overflow={"auto"}>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleOnClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ mt: 0 }}
      >
        {/* <Typography sx={{ p: 2 }}>This is an anchored dialog.</Typography> */}
        <>
        <Stack sx={{ width: 320, p: 2,maxHeight:"420px" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Notifications
        </Typography>

        {isLoading ? (
          <Typography variant="body2">Loading...</Typography>
        ):data.notifyB.length>0 ?(
          data.notifyB.map(({_id,sender,body})=><UserNotifyItem body={body} sender={sender} _id={_id} />) 
        ):(
          <Typography variant="body2" sx={{ color: "gray" }}>
            No Notifications
          </Typography>
        )}

        </Stack>
            
          </>
      </Popover>

    </Stack>

  )
  
}

export default Notifications