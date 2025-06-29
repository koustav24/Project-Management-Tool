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
import WebLayout from "../component/Layouts/WebLayout"
import axios from "axios"
import { useGetDashboardStatsQuery } from "../redux/api/api"
import { LayoutLoader } from "../component/Layouts/Loader"
import GaugeChart from "../component/Charts/GaugeChart"
import { formatDate } from "../component/utility/features"


// Sample data
const statusCards = [
  { id: 1, title: "Overdue", count: 470, date: "July 14, 2023" },
  { id: 2, title: "Pending", count: 270, date: "July 14, 2023" },
  { id: 3, title: "In progress", count: 270, date: "July 14, 2023" },
  { id: 4, title: "Completed", count: 370, date: "July 14, 2023" },
  { id: 5, title: "On time", count: 470, date: "July 14, 2023" },
]

const projectSummary = [
  {
    id: 1,
    name: "Project Alpha",
    assignedTo: "John Smith",
    startDate: "March 04, 2023",
    dueDate: "June 30, 2023",
    status: "In Progress",
  },
  {
    id: 2,
    name: "Website Redesign",
    assignedTo: "Sarah Johnson",
    startDate: "April 15, 2023",
    dueDate: "July 15, 2023",
    status: "Pending",
  },
  {
    id: 3,
    name: "Mobile App Development",
    assignedTo: "Mike Thompson",
    startDate: "May 01, 2023",
    dueDate: "Aug 15, 2023",
    status: "Completed",
  },
  {
    id: 4,
    name: "CRM API Implementation",
    assignedTo: "Emily Rodriguez",
    startDate: "Feb 10, 2023",
    dueDate: "Dec 20, 2023",
    status: "Delayed",
  },
  {
    id: 5,
    name: "SEO & Social Media Campaign",
    assignedTo: "David Wilson",
    startDate: "Jan 05, 2023",
    dueDate: "June 15, 2023",
    status: "Completed",
  },
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

// Main Dashboard Component
const Daashyboard=()=>{
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
    
  const {data:DashyStats,isLoading:DashyStatsLoading}=useGetDashboardStatsQuery();
  console.log("Murkh Dashboard",DashyStats)

  const gaugeChartOption={
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
      {
        name: 'Tasks Progress',
        type: 'gauge',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}'
        },
        data: [
          {
            value: 50,
            name: 'Performanace'
          }
        ]
      }
    ]
  }


  const getTaskIcon = (status) => {
    return status === "completed" ? (
      <CheckCircleIcon style={{ color: "#4caf50" }} />
    ) : (
      <CancelIcon style={{ color: "#f44336" }} />
    )
  }

  // Gauge chart data
  const completionPercentage = 72

  return (
    DashyStatsLoading ? <LayoutLoader /> 
    :
    <Box
      sx={{
        padding: 3,
        backgroundColor: "rgb(255, 255, 255)",
        minHeight: "100vh",
        width:"100%"
      }}
    >
      {/* Status Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {statusCards.map((card) => (
          <Grid item xs={12} sm={6} md={2.4} key={card.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#e6f4ff",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <CalendarIcon style={{ color: "#1976d2" }} />
              </Box>
              <Typography sx={{ fontSize: "1rem", fontWeight: "medium", mb: 1 }}>{card.title}</Typography>
              <Typography sx={{ fontSize: "2rem", fontWeight: "bold", mb: 0.5 }}>{card.count}</Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>Update: {card.date}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4,mt:2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: "100%", bgcolor: "#faf8f4", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "#fbe9e7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  <Typography sx={{ color: "#ff5722", fontWeight: "bold" }}>P</Typography>
                </Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Projects
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1}}>
                {DashyStats.totalProjects}
              </Typography>
              <Typography variant="body2" color="text.secondary" >
                Check it Out
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: "100%", bgcolor: "#faf8f4", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "#e3f2fd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  <Typography sx={{ color: "#2196f3", fontWeight: "bold" }}>T</Typography>
                </Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Remaining Tasks
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {DashyStats.myTasks.length - DashyStats.totalTaskCompleted}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks are Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
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
                    {DashyStats.transformedProjects.map((project) => {
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

      {/* To-do List and Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "#faf8f4", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <CardContent>
              <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2 }}>Tasks List</Typography>
              <List>
                {DashyStats.myTasks.map((item, index) => (
                  <React.Fragment key={item._id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem>
                      <ListItemIcon>{getTaskIcon(item.status)}</ListItemIcon>
                      <ListItemText primary={item.title} />
                      <Chip
                        label={item.status}
                        color={getStatusColor(item.status)}
                        size="small"
                        sx={{ borderRadius: "4px", fontWeight: "medium", textTransform: "capitalize" }}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "#faf8f4", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <CardContent>
              <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2 }}>Projects Overview</Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" stackId="a" fill="#4caf50" />
                    <Bar dataKey="inProgress" stackId="a" fill="#2196f3" />
                    <Bar dataKey="delayed" stackId="a" fill="#f44336" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default WebLayout()(Daashyboard)

