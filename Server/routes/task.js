const express=require('express');
const { addTask, getProjectTask, getMyTask, getTaskDetails, editTask, submitTask, getSubmittedTask, deleteTask, changeTaskStatus, deleteTaskFiles } = require('../controllers/taskHandler');
const { userAuth } = require('../middleware/Auth');
const { multerUpload } = require('../middleware/multer');
const route=express.Router();


route.use(userAuth)
route.post('/createTask',addTask);
route.post('/projectTask',getProjectTask)
route.get('/mytasks',getMyTask)
route.post('/edit/:taskId',editTask)
route.post('/submit',multerUpload.array("file",5),submitTask)
route.delete('/delete/:taskId',deleteTask)
route.get('/submissionFiles/:taskId',getSubmittedTask);

route.post('/file/delete',deleteTaskFiles)

route.put('/:taskId',changeTaskStatus)



route.get('/:id',getTaskDetails)

module.exports=route;