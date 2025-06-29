import { Box, ListItem, Stack, Typography } from "@mui/material"
import { memo } from "react"


const UserNotifyItem=({body,sender,_id})=>{
  
  
  return(
    <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      backgroundColor: "#f9f9f9",
      p: 2,
      paddingBottom:1,
      borderRadius: 0,
      borderLeft: `3px solid #4caf50`, // Green for unread, Gray for read
      mb: 2,
    }}
    >
      <Stack sx={{ flexGrow: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {body}
        </Typography>
        <Typography variant="body2" sx={{ color:'gray',mb:1 }}>
          lorem ipsiunsad sadjsda sdsa dasldasd
        </Typography>
        <Typography variant="body2" sx={{ color: "gray" }}>
          2 mins ago
        </Typography>
      </Stack>


    </Box>


    // <ListItem>
    //   <Stack direction={'row'} gap={"1rem"}>
    //     <Typography>{body}</Typography>
    //   </Stack>
    // </ListItem>
  )
}

export default memo(UserNotifyItem)