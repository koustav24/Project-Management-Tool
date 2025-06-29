import { Stack, Typography } from '@mui/material';
// import {cLink} from '../Styled/StyledComponents'
import {Group as GroupIcon} from '@mui/icons-material'
import { memo } from 'react';
import { Link, NavLink } from 'react-router-dom';

const ChatItem=({
    name,
    _id,
    index
})=>{
  return(
    <NavLink to={`/communication/chats/${_id}`}
    className="navLinkHover"
    style={({ isActive }) => ({
      marginTop: "0.1rem",
      border: isActive ? "lightblue" : "transparent", // Border changes on active
      textDecoration: "none",
      color: isActive ? "blue" : "rgb(54, 52, 52)", // Text color changes on active
      borderLeft:isActive ? "3px solid blue" : "none",
      backgroundColor:isActive ? "lightblue" : "transparent",
      
      ":hover": {
      backgroundColor: "rgba(51, 163, 201, 0.97)", // Light blue on hover
      color: "darkblue", // Change text color on hover
    }
    })}
    >
      <Stack direction={'row'} justifyContent={"left"} p={1.1}
       boxShadow={"8px -2px 67px -21px rgba(0,0,0,0.75)"}
       sx={{
        transition: "background-color 0.1s ease, color 0.1s ease",
        "&:hover": { 
          backgroundColor: "rgba(18, 230, 177, 0.51)", 
          color: "darkblue"
        }
       }}
       >
        <GroupIcon sx={{alignSelf:"flex-start",mx:3,marginRight:4}}  />
        <Typography variant='subtitle2'
        sx={{fontFamily:'Figtree',fontStyle:"revert-layer",fontWeight:"600"}}
       
        >{name}</Typography>  
      </Stack>  
    </NavLink>
    
  )
}

export default memo(ChatItem);