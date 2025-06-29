
import { Add, ArrowBack, ArrowForward, Search } from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import AddProjectDialog from "../../component/Dialog/AddProjectDialog";
import { useGetMyProjectsQuery } from "../../redux/api/api";
import AdminLayout from "../../component/Layouts/AdminLayout";
import { useEffect, useMemo, useState } from "react";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Pagination, PaginationItem, Skeleton, Stack, Typography } from "@mui/material";
import { useGetAllProjectAdminQuery } from "../../redux/api/adminApi";
import { LayoutLoader } from "../../component/Layouts/Loader";

const AdminProjects=()=>{
     const projects = Array.from({ length: 9 }, (_, i) => ({
        id: i + 1,
        name: "Design Project",
        teamLead: "Arjun Kumar",
        teamMembers: 33,
        deadline: "27-02-2025",
      }))
    
      const navigate=useNavigate();
      const [displayProjects,setDisplayProjects]=useState([]);
      const [selectedFilter, setSelectedFilter] = useState("all")
      const [isFirstLoad, setIsFirstLoad] = useState(true);

      const {data:adminAllProjects,isLoading:adminAllProjectsLoading}=useGetAllProjectAdminQuery();
      console.log("Admmin page Projects",adminAllProjects)

      const {data:AllProject,isLoading:allProjectsLoading}=useGetMyProjectsQuery();
    
      useEffect(() => {
        if (isFirstLoad && !adminAllProjectsLoading && adminAllProjects) {
          setDisplayProjects(adminAllProjects.Projects);
          setIsFirstLoad(false); // Prevent further updates
        }
      }, [adminAllProjectsLoading, adminAllProjects, isFirstLoad]);
      

      const AllProjects=useMemo(()=>{
        if(!allProjectsLoading){
          return AllProject?.Projects
        }
        return [];
      },[allProjectsLoading])
    
    
      console.log("piro",AllProject)
    
      const [search, setSearch] = useState("")
      const [page, setPage] = useState(1)
      const [itemsPerPage, setItemsPerPage] = useState(6)
      const [openProjectDialog,setopenProjectDialog]=useState(false);
    
      const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()))
    
      const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
      const displayedProjects = filteredProjects.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    
      const handlePageChange = (event, value) => {
        setPage(value)
      }

      const handleSelectAllProjects=()=>{
        setSelectedFilter("all");
        if(selectedFilter==="all") return;
        setDisplayProjects(adminAllProjects?.Projects);
      }
      console.log("first time new thing update",displayProjects)

      const handleSelectArchyProjects=()=>{
        setSelectedFilter("archived");
        setDisplayProjects(adminAllProjects?.archyProjects)
      }
    
      const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number.parseInt(event.target.value))
        setPage(1) // Reset to first page when changing items per page
      }
      const handleAddProject=()=>{
        console.log("add Project");
        setopenProjectDialog(true);
        
      }
      return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header with search and add button */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "white", borderRadius: "4px", px: 2, py: 1 }}>
              <Search color="action" sx={{ mr: 1 }} />
              <input
                style={{ border: "none", outline: "none", width: "200px" }}
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                borderRadius: "7px",
                bgcolor: "#2979FF",
                "&:hover": { bgcolor: "#1565C0" },
              }}
              onClick={handleAddProject}
            >
              Project
            </Button>
            {openProjectDialog && <AddProjectDialog  open={openProjectDialog} DialogHandler={setopenProjectDialog} />}
          </Stack>
    
          {/* Project title */}
          <Typography variant="h6" fontWeight="bold" sx={{ px: 2 }}>
            All Projects
          </Typography>
          <Stack direction={'row'} px={2} py={1} gap={2}>
            <Chip label={"All Projects"} 
             sx={{cursor:'pointer'}} onClick={handleSelectAllProjects} 
             variant={selectedFilter === "all" ? "filled" : "outlined"} 
             color={selectedFilter === "all" ? "primary" : "default"} 
             />
            <Chip label={"Archived"} 
              variant={selectedFilter === "archived" ? "filled" : "outlined"}
              color={selectedFilter === "archived" ? "primary" : "default"}
             sx={{cursor:'pointer'}}
             onClick={handleSelectArchyProjects}

             />
            
          </Stack>

          {/* Projects grid */}
          {adminAllProjectsLoading? (<LayoutLoader />):(
          <Box sx={{ flexGrow: 1, px: 2 }}>
            <Grid container spacing={2}>
              {displayProjects?.map((project, index) => (
                <Grid item key={project._id} xs={12} sm={6} md={4}>
                  <Link to={`/adminproject/${project._id}`} style={{textDecoration:"none"}} >
                  <Card sx={{ height: "100%", borderRadius: 2,
                     boxShadow: "0px 2px 6px 2px rgba(0, 0, 0, 0.1)",cursor:"pointer" }}
                    // onClick={()=>navigate('/pr')}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" mb={2}>
                        {project.name}
                      </Typography>
    
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          PC:
                        </Typography>
                        {/* <Link to="#" style={{ color: "#2979FF", textDecoration: "none", fontSize: "14px" }}>
                          Edit
                        </Link> */}
                        <Typography variant="body2" >
                         {project.creator.name}
                        </Typography>
                      </Box>
    
                        <Box display="flex" justifyContent="space-between" alignItems="center" >
                      <Typography variant="body2" color="text.secondary">
                        Total Members:
                      </Typography>
                      <Typography fontWeight="medium" mb={2}>
                        {project.totalMembers}
                      </Typography>
                      </Box>
    
                      <Divider sx={{ my: 1 }} />
    
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Deadline
                        </Typography>
                        <Typography fontWeight="medium">
                          {new Date(project.deadline).toLocaleDateString('en-GB')
                            .replace(/\//g, "-")}
                          </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
    )}
          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderTop: "1px solid #eee",
              mt: "auto",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary" mr={1}>
                Showing
              </Typography>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  marginRight: "8px",
                }}
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
              </select>
              <Typography variant="body2" color="text.secondary">
                {`${(page - 1) * itemsPerPage + 1} to ${Math.min(page * itemsPerPage, filteredProjects.length)} out of ${filteredProjects.length} records`}
              </Typography>
            </Box>
    
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              renderItem={(item) => (
                <PaginationItem
                  components={{ previous: ArrowBack, next: ArrowForward }}
                  {...item}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "#2979FF",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#1565C0",
                      },
                    },
                  }}
                />
              )}
            />
          </Box>
        </Box>
      )
}

export default AdminLayout()(AdminProjects)