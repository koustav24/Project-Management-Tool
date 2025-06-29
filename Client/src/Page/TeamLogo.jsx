import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import React from "react";

const TeamLogo = () => {

    return (
        <>
            <AppBar position="relative" color="transparent" elevation={0} sx={{ backgroundColor: "white", paddingY: 0.2,}}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "auto", width: "100%", flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
        src="src/assets/Screenshot_2025-02-16_211044-removebg-preview 1.png"
        alt="Logo"
        style={{ height: "40px" }} 
      />
      <Typography variant="h4" sx={{ fontWeight: 600, fontFamily: "DM Sans",fontSize:"32px",color:"rgb(53, 51, 51)" }}>
        TeamSync
      </Typography>
    </Box>
    
                </Toolbar>
            </AppBar>
            
        </>
    );
};

export default TeamLogo;