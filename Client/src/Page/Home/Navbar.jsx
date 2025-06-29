import { AppBar, Toolbar, Typography, Button, Container, Grid, Box, Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate=useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setMobileOpen(false);
    };

    const drawer = (
        <Box sx={{ width: 250, padding: 2 }} role="presentation" onClick={handleDrawerToggle}>
            <IconButton onClick={handleDrawerToggle} sx={{ alignSelf: "flex-end" }}>
                <CloseIcon />
            </IconButton>
            <List>
                {["Home", "Scout", "Blog", "Features"].map((text) => (
                    <ListItem button key={text} onClick={() => scrollToSection(text.toLowerCase())}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" color="transparent" elevation={0} sx={{ backgroundColor: "white", paddingY: 1, borderBottom: "1px solid #ccc" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "auto", width: "100%", flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1,cursor: "pointer" }}  onClick={() => scrollToSection("home")}>
                        <img
            src="src/assets/Screenshot_2025-02-16_211044-removebg-preview 1.png"
            alt="Logo"
            style={{ height: "40px" }} // Adjust height as needed
          />
          <Typography variant="h4" sx={{ fontWeight: 600, fontFamily: "Inter" }}>
            TeamSync
          </Typography>
        </Box>
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                        <Button color="inherit" onClick={() => scrollToSection("home")}>Home</Button>
                        <Button color="inherit" onClick={() => scrollToSection("scout")}>Scout</Button>
                        <Button color="inherit" onClick={() => scrollToSection("blog")}>Blog</Button>
                        <Button color="inherit" onClick={() => scrollToSection("features")}>Features</Button>
                    </Box>
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                        <Button variant="outlined" onClick={()=>navigate('/signin')} >Log in</Button>
                        <Button variant="contained" color="primary" onClick={()=>navigate('/signup')} >Get Started</Button>
                    </Box>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { md: "none" } }}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;