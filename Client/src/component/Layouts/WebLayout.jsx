import { Box, Grid, Stack, Typography, IconButton, Button, TextField, InputAdornment, Avatar, Badge, Chip, CircularProgress } from "@mui/material"
import {
  DashboardOutlined,
  Group,
  LogoutOutlined,
  Message,
  Notifications,
  Person,
  Search as SearchIcon,
  Settings,
} from "@mui/icons-material"
import { useLocation, useNavigate } from "react-router-dom"
import { Link } from "../Styled/StyledComponents"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { userNotExists } from "../../redux/reducers/auth"
import { getSocket } from "../../Socket"
import { incNotifications } from "../../redux/reducers/project"
import { useSocketEvents } from "../Hooks/Hooks"
import { lazy, Suspense, useCallback, useEffect, useState } from "react"

import { getOrSaveFromLocalStorage } from "../utility/features"

const NotificationsD=lazy(()=>import('../Specific/Notifications'));
const LazyLogoutDialog=lazy(()=>import('../Dialog/LogoutDialog'));

const WebLayout = () => (WrappedComponent) => {
  return (props) => {
    const location = useLocation()
    const dispatch=useDispatch();
    const navigate=useNavigate()
    const {user}=useSelector((state)=>state.auth)
    console.log("madsadknjv kdfjvmaksead",user)
    const {notificationsCount}=useSelector((state)=>state.project)
    console.log("saareassads teri bhes ",notificationsCount)
    console.log("madarchod",typeof notificationsCount)

    useEffect(()=>{
      if(user){
      getOrSaveFromLocalStorage({key:'Notify',value:notificationsCount,userId:user._id})
      }
    },[notificationsCount,user])

    useEffect(() => {
      if (user?._id) {
        localStorage.setItem("userId", user._id)
      }
    }, [user])

    const [openNotify,setNotify]=useState(false);
    const [notifyAnchor,setNotifyAnchor]=useState(null)
    const [openLogout,setOpenLogout]=useState(false);

    const socket=getSocket()

    console.log("Wb layout",socket?.id);

    const newNotifyHandler=useCallback(()=>{
      console.log("notifiactions");
      dispatch(incNotifications())
    },[dispatch])

    console.log("optimized ch",user?._id)

    const newCommentHandler=useCallback((data)=>{
      console.log("sda");
    console.log("handler psis", data);

    // Ensure data has an 'assigned' property that is an array
    const assignedUsers = data?.assigned;  // Directly access 'assigned' in the object
    console.log("assignedUsers", assignedUsers);

    if (Array.isArray(assignedUsers) && assignedUsers.some(
    assignedId => String(assignedId) === String(user?._id)
  )) {
        console.log("2");
        dispatch(incNotifications());
    }
    },[dispatch,user])

    const incrementNotifications=useCallback(()=>{
      console.log("notifiactions");
      dispatch(incNotifications())
    },[dispatch]);

    const eventArr={
      "New_Task":incrementNotifications,
      "New_Comment":newCommentHandler,
      "New_Project":incrementNotifications
    }

    useSocketEvents(socket,eventArr)

    const handleNotify=(e)=>{
      console.log("y")
      setNotifyAnchor(e.currentTarget);
      console.log("noti",e.currentTarget);
      setNotify(true)
    }

    const Easy = ({ Icons, Name, loca }) => {
      const isActive = location.pathname === loca
      return (
        <Link to={loca} active={isActive}>
          <Stack direction={"row"} alignItems={"center"}>
            <IconButton color="default">{Icons}</IconButton>
            <Typography variant="subtitle2"> {Name}</Typography>
          </Stack>
        </Link>
      )
    }
    const handleLogout = async() => {
    console.log("logo")
    setOpenLogout(true);
        // try {
        //   await axios.post("http://localhost:3000/logout",{},{withCredentials: true })
          
        //   dispatch(userNotExists())    
        //   navigate("/signin ");
        // } catch (error) {
        //   console.log(error)
        // }
    
      };

    return (
      <>
       <Suspense fallback={
      <CircularProgress sx={{ display: "flex", justifyContent: "center" }} />
        }>
        {openNotify && <NotificationsD open={openNotify} onClose={() => setNotify(false)} anchorEl={notifyAnchor} />}
      </Suspense>
        <Grid container spacing={2} sx={{ height: "100vh", p: 2, paddingBottom: 0, paddingRight: 0 }}>
          {/* Sidebar */}
          <Grid
            item
            sm={2}
            sx={{
              display: { xs: "none", md: "flex" },
              bgcolor: "#6092FF0D",
              height: "100%",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <Stack
              direction={"row"}
              gap={2}
              alignItems={"center"}
              justifyContent={"flex-start"}
              sx={{ width: "100%", p: 1, mb: "auto" }}
            >
              <Box width={"40px"}>
                <img src="src/assets/TeamSyncLogo.png" alt="" />
              </Box>
              <Typography variant="body1" sx={{ fontFamily: "Fitgree", fontSize: "1.2rem" }}>
                TeamSync
              </Typography>
            </Stack>

            <Stack
              alignSelf={"center"}
              gap={1}
              sx={{
                flexGrow: 1,
                justifyContent: "center",
                width: "100%",
                marginTop: -18,
              }}
            >
              <Easy Icons={<DashboardOutlined sx={{ fontSize: "medium" }} />} Name={"Dashboard"} loca={"/dashboard"} />
              <Easy Icons={<Person sx={{ fontSize: "medium" }} />} Name={"Projects"} loca={"/Projects"} />
              <Easy Icons={<Group sx={{ fontSize: "medium" }} />} Name={"Task Management"} loca={"/task"} />
              <Easy Icons={<Message sx={{ fontSize: "medium" }} />} Name={"Communication"} loca={"/communication"} />
            </Stack>

            <Stack direction={"row"} width={"100%"} justifyContent={"center"} paddingBottom={3}>
              <Button
                variant="contained"
                startIcon={<LogoutOutlined />}
                sx={{
                  backgroundColor: "#2979FF",
                  color: "#FFF",
                  borderRadius: "8px",
                  width: "60%",
                  mt: "auto",
                  "&:hover": { backgroundColor: "#1565C0" },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Stack>
          </Grid>

          {/* Main Content - Fixed to ensure proper containment */}
          <Grid
            item
            xs={12}
            md={10}
            sx={{
              p: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden", // Prevent overflow at this level
            }}
            style={{paddingTop:0}}
          >
            <Grid item sx={{ bgcolor: "white", height: "4rem", width: "100%",padding:0 }}>
              
              
              <Stack direction={"row"} justifyContent={"space-between"} >
                <Box>
                  <Typography variant="h6" fontFamily={"Figtree"}>
                    Hello Kaustubh 
                    {/* {user} */}
                    
                    
                  </Typography>
                  <Typography variant="body2" color="gray">
                    Mon, March 10, 2025
                  </Typography>
                </Box>
                {/* <Box display={"flex"} sx={{ flexGrow: 1 }}></Box> */}

                <Stack direction={'row'} gap={1}>
                <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Search..."
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "8px", // Adjust padding inside input
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Stack direction={"row"} padding={0} spacing={1} >
                  <IconButton>
                    <Settings />
                  </IconButton>

                  <IconButton onClick={handleNotify} style={{marginLeft:0}} >
                     <Badge badgeContent={notificationsCount} color="error" showZero>
                       <Notifications />
                     </Badge>
                    
                  </IconButton>

                  {console.log("user",user?.profilePic)}
                    <Avatar src={user?.profilePic}></Avatar>
                  
                </Stack>
                </Stack>
              </Stack>
            </Grid>

            <Grid
              item
              sx={{
                bgcolor: "white",
                flexGrow: 1,
                width: "100%",
                minHeight: 0,
                
                display: "flex", // Added to ensure child components fill the space
                overflowY: "auto"
              }}
            >
              <Suspense fallback={<CircularProgress />} >
                  {openLogout && <LazyLogoutDialog open={openLogout} onClose={()=>setOpenLogout(false)} />}
              </Suspense>

              {<WrappedComponent {...props} />}
            </Grid>
          </Grid>
        </Grid>
        
         


      </>
    )
  }
}

export default WebLayout

