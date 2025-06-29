import React, { useState } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Button } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkspacesIcon from "@mui/icons-material/Workspaces"; // Projects Icon
import TaskIcon from "@mui/icons-material/AssignmentTurnedIn";
import FolderIcon from "@mui/icons-material/Folder";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = useState(1); // Active item (Projects)

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 200,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 200,
          boxSizing: "border-box",
          backgroundColor: "#F7F9FC", // Light background color
          borderRight: "none", // Removes default border
        },
      }}
    >
      <Box sx={{ mt: 4, px: 2 }}>
        <List>
          {/* Dashboard */}
          <ListItemButton selected={selectedIndex === 0} onClick={() => handleListItemClick(0)}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          {/* Projects (Active) */}
          <ListItemButton
            selected={selectedIndex === 1}
            onClick={() => handleListItemClick(1)}
            sx={{
              bgcolor: selectedIndex === 1 ? "rgba(33, 150, 243, 0.1)" : "transparent",
              borderRadius: "8px",
              "&.Mui-selected": { color: "blue" },
            }}
          >
            <ListItemIcon>
              <WorkspacesIcon sx={{ color: selectedIndex === 1 ? "blue" : "inherit" }} />
            </ListItemIcon>
            <ListItemText primary="Projects" />
          </ListItemButton>

          {/* Task Management */}
          <ListItemButton selected={selectedIndex === 2} onClick={() => handleListItemClick(2)}>
            <ListItemIcon>
              <TaskIcon />
            </ListItemIcon>
            <ListItemText primary="Task Management" />
          </ListItemButton>

          {/* File Management */}
          <ListItemButton selected={selectedIndex === 3} onClick={() => handleListItemClick(3)}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="File Management" />
          </ListItemButton>

          {/* Communication */}
          <ListItemButton selected={selectedIndex === 4} onClick={() => handleListItemClick(4)}>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="Communication" />
          </ListItemButton>
        </List>
      </Box>

      {/* Logout Button (Placed at Bottom) */}
      <Box sx={{ position: "absolute", bottom: 20, width: "100%", px: 2 }}>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          startIcon={<LogoutIcon />}
          sx={{ textTransform: "none", borderRadius: "8px" }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
