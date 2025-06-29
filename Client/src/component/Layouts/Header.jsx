import React from "react";
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton, Avatar, Menu, MenuItem, Stack } from "@mui/material";
import { Search as SearchIcon, Settings, Notifications,ArrowDropDown } from "@mui/icons-material";

const Header = () => {
    return (
        <AppBar position="static" elevation={0} sx={{ bgcolor: "white", color: "black",
             px: 1, py: 1,height:"4rem" }}
        
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>

               <Stack sx={{display:{xs:"none",sm:"block"}}} 
               direction={'row'} alignItems={"center"}> 

               <Box sx={{width:"20px",height:"20px"}}>
                <img src="src/assets/TeamSyncLogo.png" width={"100%"} height={"100%"}></img>
                </Box>
                
                <Typography variant="body1" 
                fontFamily={"revert-layer"}
                fontSize={"19px"}
                >
                    Team Sync
                </Typography>
                
                </Stack>

                {/* Left Section - Greeting and Date */}
                
                <Box>
                    <Typography variant="h6"  fontFamily={"Figtree"}>
                        Hello Arun 👋
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Mon, Feb 25, 2025
                    </Typography>
                </Box>

                {/* Middle Section - Search Bar */}
                <Box sx={{ display: "flex", alignItems: "center",
                     bgcolor: "rgb(253, 250, 250)", borderRadius: 2, px: 2, py: 1, width: "30%" }}>
                    <SearchIcon color="action" />
                    <InputBase placeholder="Search" sx={{ ml: 1, flex: 1 }} />
                </Box>

                {/* Right Section - Icons and Profile */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton>
                        <Settings />
                    </IconButton>
                    <IconButton>
                        <Notifications />
                    </IconButton>

                    {/* User Profile */}
                    <IconButton sx={{color:"black",":hover":{backgroundColor:"transparent"}}}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar src="https://via.placeholder.com/40" />
                        {/* <Stack direction={'column'}> */}
                            <Typography variant="body1" fontFamily={"Figtree"} fontWeight="590">
                                Arun Kumar
                            </Typography>
                            {/* <Typography variant="body2" color="gray"> */}
                                {/* Admin
                            </Typography>
                        </Stack> */}
                        <ArrowDropDown />
                        
                    </Box>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
