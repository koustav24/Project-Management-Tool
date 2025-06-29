import React from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  IconButton,
  Divider,
  Skeleton,
} from "@mui/material"
import {
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useGetAdminDashboardStatsQuery, useGetAdminUserTasksQuery, useGetDashboardStatsQuery } from "../../redux/api/api"
import { LayoutLoader } from "../../component/Layouts/Loader"
import AdminLayout from "../../component/Layouts/AdminLayout"
import GaugeChart from "../../component/Charts/GaugeChart"
import {formatDate} from "../../component/utility/features"

const statusCards = [
    { id: 1, title: "Overdue", count: 470, date: "July 14, 2023" },
    { id: 2, title: "Pending", count: 270, date: "July 14, 2023" },
    { id: 3, title: "In progress", count: 270, date: "July 14, 2023" },
    { id: 4, title: "Completed", count: 370, date: "July 14, 2023" },
    { id: 5, title: "On time", count: 470, date: "July 14, 2023" },
  ]
  
  
  const todoList = [
    { id: 1, task: "Review project requirements", status: "completed" },
    { id: 2, task: "Create a new UI for dashboard design", status: "pending" },
    { id: 3, task: "Fix bugs found in QA / Approval of application", status: "completed" },
    { id: 4, task: "Create new project for app client / development phase", status: "pending" },
  ]
  
  const chartData = [
    { name: "Jan", completed: 65, inProgress: 20, delayed: 15 },
    { name: "Feb", completed: 50, inProgress: 30, delayed: 20 },
    { name: "Mar", completed: 75, inProgress: 15, delayed: 10 },
    { name: "Apr", completed: 60, inProgress: 25, delayed: 15 },
    { name: "May", completed: 70, inProgress: 20, delayed: 10 },
  ]

const AdminDashboard=()=>{

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success"
      case "in progress":
        return "info"
      case "pending":
        return "warning"
      case "delayed":
        return "error"
      default:
        return "default"
    }
  }

   
   const {data:AdminDashyStats,isLoading:AdminDashyStatsLoading}=useGetAdminDashboardStatsQuery();
   const {data:userTaskStats,isLoading:userTaskStatusLoading}=useGetAdminUserTasksQuery();
  //  console.log("kaay bhoks vay be Part 2",DashyStats)
   console.log("kaay bhoks vay be",AdminDashyStats)
   console.log("kaay bhoks vay be Tasky",userTaskStats)
   
   const getTaskIcon = (status) => {
       return status === "completed" ? (
         <CheckCircleIcon style={{ color: "#4caf50" }} />
       ) : (
         <CancelIcon style={{ color: "#f44336" }} />
       )
     }

  return(
     AdminDashyStatsLoading ? <LayoutLoader /> 
      :
      <Box
      sx={{
        padding: 0,
        backgroundColor: "rgb(255, 255, 255)",
        minHeight: "100vh",
        width:"100%"
      }}
    >

      {/* Stats Cards */}
    <Grid container spacing={3} sx={{ mb: 4,mt:0 }}>
     <Grid item xs={12} sm={4} md={4}>
      <Card sx={{ bgcolor: "#faf8f4", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", height: "100%" }}>
      <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Grid container sx={{ height: "100%" }}>
        {/* First Card - Full Width & Half Height */}
        <Grid item xs={12} sx={{ height: "50%" }}>
          <Card sx={{ bgcolor: "#faf8f4", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", height: "90%" }}>
            <CardContent sx={{ textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "#fbe9e7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ color: "#ff5722", fontWeight: "bold" }}>P</Typography>
                </Box>
              </Box>
              <Typography variant="subtitle2" color="text.secondary">Projects</Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {AdminDashyStats?.totalProjects}
              </Typography>
              <Typography variant="body2" color="text.secondary">Check it Out</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Second Card - Full Width & Half Height */}
        <Grid item xs={12} sx={{ height: "50%" }}>
          <Card sx={{ bgcolor: "#faf8f4", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", height: "90%" }}>
            <CardContent sx={{ textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "#fbe9e7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ color: "#ff5722", fontWeight: "bold" }}>U</Typography>
                </Box>
              </Box>
              <Typography variant="subtitle2" color="text.secondary">Users</Typography>
              {userTaskStatusLoading ? <Skeleton /> :
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {userTaskStats?.userData?.length}
                
              </Typography>
              }
              <Typography variant="body2" color="text.secondary">Check it Out</Typography>
            </CardContent>
          </Card>
          </Grid>
        </Grid>
        </CardContent>
      </Card>
      </Grid>

        
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%", bgcolor: "#faf8f4", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <CardContent>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2 }}>Overall Progress</Typography>
                
                    <GaugeChart />

                <Box sx={{ display: "flex", justifyContent: "space-around", width: "100%", mt: 0.2 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="#4caf50">
                      65
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      In Progress
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="#2196f3">
                      20
                    </Typography>
                  </Box>
                  
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Project Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ bgcolor: "#faf8f4", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>Project Summary</Typography>
                <Box>
                  <Button variant="outlined" size="small" startIcon={<AddIcon />} sx={{ mr: 1, borderRadius: "4px" }}>
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FilterListIcon />}
                    sx={{ mr: 1, borderRadius: "4px" }}
                  >
                    Filter
                  </Button>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
              <TableContainer component={Paper} sx={{ boxShadow: "none", bgcolor: "transparent" }}>
                <Table sx={{ minWidth: 650 }} aria-label="project summary table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Creator</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Total Task</TableCell>
                      <TableCell>Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {AdminDashyStats?.transformedProjects.map((project) => {
                      const dueDate=formatDate(project.deadline)
                    return (
                      <TableRow key={project._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {project.name}
                        </TableCell>
                        <TableCell>{project.creator.name}</TableCell>
                        <TableCell>{dueDate}</TableCell>
                        <TableCell>{project.totalTasks}</TableCell>
                        
                        <TableCell>
                          <LinearProgress
                            variant="determinate"
                            value={Math.floor(project.completedTask/project.totalTasks*100)}
                            sx={{ height: 8, borderRadius: 5 }}
                          />
                        </TableCell>
                      </TableRow>
                    )
                    }
                  )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* User Task Shower */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          {/* <Card sx={{ bgcolor: "#faf8f4", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <CardContent> */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>User Summary</Typography>
                
              </Box>
              {userTaskStatusLoading ? <Skeleton />: 
              <TableContainer component={Paper} sx={{ boxShadow: "-moz-initial", bgcolor: "whitesmoke" }}>
                <Table sx={{ minWidth: 650 }} aria-label="project summary table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Total Tasks</TableCell>
                      <TableCell>Completed Tasks</TableCell>
                      <TableCell>In Review Tasks</TableCell>
                      <TableCell>Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userTaskStats?.userData.map((task) => {
                    return (
                      <TableRow key={task._id} >
                        <TableCell component="th" scope="row">
                          {task.name}
                        </TableCell>
                        <TableCell>{task.totalTasks}</TableCell>
                        <TableCell>{task.completedTasks}</TableCell>
                        <TableCell>{task.inReviewTasks}</TableCell>
                        
                        <TableCell>
                          <LinearProgress
                            variant="determinate"
                            value={Math.floor(task.completedTasks/task.totalTasks*100)}
                            sx={{ height: 8, borderRadius: 5 }}
                          />
                        </TableCell>
                      </TableRow>
                    )
                    }
                  )}
                  </TableBody>
                </Table>
              </TableContainer>
              }
        </Grid>
      </Grid>


    </Box>
  )

}

export default AdminLayout()(AdminDashboard)