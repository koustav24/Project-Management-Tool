const express=require('express');
const { userAuth } = require('../middleware/Auth');
const { NewProject, getMyProjects, getProjectDetails, getProjectMembers, editProject, DeleteProject } = require('../controllers/projectHandler');
const { multerUpload } = require('../middleware/multer');
const route=express.Router();

route.use(userAuth);

route.post('/NewProjects',multerUpload.array("file",5),NewProject)
route.get('/allProjects',getMyProjects)
route.delete('/delete/:projectId',DeleteProject);
route.post('/projects/members',getProjectMembers)
route.get('/:id',getProjectDetails)
route.post('/p/:projectId',editProject)

module.exports=route