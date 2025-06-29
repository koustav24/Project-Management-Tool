const { tryCatcher, ErrorHandler } = require('../utility/errorHandler');
const Project = require('../models/Projects');
const Task = require('../models/Task');
const User = require('../models/user');
const TaskSubmission=require('../models/taskSubmission');
const { cloudinary } = require('../cloudinary/config');
const chat = require('../models/chat');

const AdminDashboardStats=tryCatcher(async(req,res,next)=>{
  const myProjects=await Project.find({})
                        .populate('creator','name');
  
  const totalProjects=myProjects.length;

  const transformedProjects=await Promise.all(
      myProjects.map(async({_id,name,creator,deadline,description,tasks})=>{
        const totalTasks=tasks.length;
        const completedTask=await Task.countDocuments(
          {
            projectId:_id,
            status:{$in:["Completed"]}
          })
          return(
            {_id,name,creator,deadline,description,totalTasks,completedTask}
          )
      })
  )
  res.status(200).json({success:true,transformedProjects,totalProjects})

})

const adminUsersTaskData=tryCatcher(async(req,res,next)=>{

  const users=await User.find({});

  const usersWithTasks=await User.aggregate([
    {
      $lookup:{
        from:"tasks",
        localField:"_id",
        foreignField:"assignedTo",
        as:"tasks"
      },
    },
    {
      $project:{
        name:1,
        totalTasks:{$size:"$tasks"},
        completedTasks:{
          $size:{
            $filter:{
              input:"$tasks",
              as:"task",
              cond:{$eq:["$$task.status","Completed"]}
            },
          },
        },
        inReviewTasks:{
          $size:{
            $filter:{
              input:"$tasks",
              as:"task",
              cond:{$eq:["$$task.status","In Review"]}
            },
          },
        },
      }
    }
  ]);

  res.status(200).json({success:true,userData:usersWithTasks})


})

const getallProjects=tryCatcher(async(req,res,next)=>{
  console.log("Fetching all projects...");
  const a=await Project.find({}).populate("creator","name");
  console.log("archyProjecty")
  const archy=await Project.find({isArchived:true}).populate("creator","name");
  const transformedProjects=(pr)=>{ 
    return pr.map(({_id,name,creator,teamMembers,deadline})=>{
        const totalMembers=teamMembers.length
        return{
            _id,name,creator,totalMembers,deadline
        }
      })
  }
  
  const transformedProjectu=transformedProjects(a)
  const archyProjecty=transformedProjects(archy)
  

  return res.status(200).json({msg:"Succesfully fetched the Projects",
    Projects:transformedProjectu,
    archyProjects:archyProjecty
  })
})

const deleteProject=tryCatcher(async(req,res,next)=>{
  const {projectId}=req.params;
  console.log("projectId type:", typeof projectId, "value:", projectId); // 
  console.log("deler",projectId)

  if(!projectId){
        return next(new ErrorHandler("Please Chek your url",404));
        }

  const pk=await Project.findById(projectId);

  if(!pk){
    return next(new ErrorHandler("Project not Found",404));
    }
  console.log("requset",req.admin)
  if(req.admin !== "Admin"){
      return next(new ErrorHandler("You are nit autherize to delete that "))
    }
  
  await Task.deleteMany({_id:{$in: pk.tasks }})
      
  await Project.findByIdAndDelete(projectId)
  
  res.status(200).json({ message: 'Project and related tasks are deleted successfully' })

})

const updateProject=tryCatcher(async(req,res,next)=>{
  const {projectId}=req.params;
  console.log("tere taraf aara hai req")
  const {projectTitle,description,teamMembers,dueDate}=req.body;

  const projectUpdation=await Project.findById(projectId);

  if(!projectUpdation){
    return next(new ErrorHandler("Project not Found",404))
  }
  if(req.admin !== "Admin" ){
      return next(new ErrorHandler("You are not authorize to edit the project"))
    }
      projectUpdation.name=projectTitle || projectUpdation.name;
      projectUpdation.description=description || projectUpdation.description;
      projectUpdation.teamMembers=teamMembers || projectUpdation.teamMembers;
      projectUpdation.deadline=dueDate || projectUpdation.deadline;
    
      await projectUpdation.save()
      res.status(200).json({msg:"Project updated Succesfully",project:projectUpdation})
  
  // Emit the Event

})

const deleteTask=tryCatcher(async(req,res,next)=>{
  const {taskId}=req.params;
    console.log("deler",taskId)
    if(!taskId){
        return next(new ErrorHandler("Task not Found",404));
    }
    const tak=await Task.findById(taskId);
    if(!tak){
        return next(new ErrorHandler("Task not Found",404));
    }
    if(req.admin !=="Admin"){
        return next(new ErrorHandler("You are nit autherize to delete that "))
    }

    const piro=await Project.findById(tak.projectId)
    if(!piro){
        return next(new ErrorHandler("Project not Found",404));
    }
    piro.tasks.filter((e)=>e.toString()!==taskId)
    await piro.save()
    await Task.findByIdAndDelete(taskId);
    res.status(201).json({msg:"Succesfully Deleted The Task",success:true})
})

const editTask=tryCatcher(async(req,res,next)=>{
  const {taskId}=req.params;
  // projectTitle,piroA,assignees,dueDate,reminder
  const {projectTitle,description,piroA,assignees,dueDate,reminder}=req.body;
  console.log(taskId)

  const eTask=await Task.findById(taskId);
  if(!eTask){
      return next(new ErrorHandler("Task Not Found",404));
    }
  if(req.admin !=="Admin" ){
    return next(new ErrorHandler("You are Not Autherize to Edit ",404));
  }
        
    eTask.title=projectTitle;
    eTask.description=description;
    eTask.projectId=piroA;
    eTask.assignedTo=assignees;
    eTask.deadline=dueDate;
    eTask.reminder=reminder;
    await eTask.save();
    res.status(200).json({ message: 'Task updated successfully', task: eTask });

})

const changeProjectStatus=tryCatcher(async(req,res,next)=>{
  const {projectId,archy}=req.body;
  console.log("change",projectId)
  const ps=await Project.findById(projectId);
  if(!ps){
    return next(new ErrorHandler("Project Not Found related To that Task",404));
  }
  ps.isArchived=archy;
  await ps.save();
  
  res.status(200).json({ success:true,message: 'Project Status Changed successfully',s:archy});
})

const changeTaskStatus=tryCatcher(async(req,res,next)=>{
  const {taskId,projectId,archy}=req.body;
  
  const ps=await Project.findById(projectId);
  if(!ps){
    return next(new ErrorHandler("Project Not Found related To that Task",404));
  }
  const ts=await Task.findById(taskId);
  if(!ts){
    return next(new ErrorHandler("Invalid Task",404));
  }
  ts.status=archy;
  await ts.save();
  res.status(200).json({ success:true,message: 'Task Status Changed successfully'});
})

const deleteTaskFiles=tryCatcher(async(req,res,next)=>{
    const {public_id,taskId}=req.body;
    console.log("Received body:", req.body)
    console.log(public_id)    

    if(!public_id || !taskId){
        return next(new ErrorHandler("Task ID and File Public ID are required", 400));
    }

    const ts=await TaskSubmission.findOne({"files.public_id": public_id})

    if(!ts){
        return next(new ErrorHandler("No task found with the provided file ID", 404));
    }
    if(req.admin !== 'Admin'){
        return next(new ErrorHandler("You are not authorized to delete this file", 403));
    }

    const result = await cloudinary.uploader.destroy(public_id)
    
    if (result.result !== "ok") {
        return next(new ErrorHandler("Failed to delete file from Cloudinary", 500));
    }

    ts.files=ts.files.filter(f=>f.public_id !== public_id)
    await ts.save();
    // console.log("last2")
    res.status(200).json({ msg: "File deleted successfully",result 
    });

})

const getAllChats=tryCatcher(async(req,res,next)=>{
  console.log('All CHats')
   const group=await chat.find({}).populate("members","name")
      console.log("Admin")
      const grpy=group.map(({members,_id,name})=>({
        _id,
        name,
        members
    }))
    console.log(group)
  
    return res.status(201).json({success:true,gChats:grpy})
})

module.exports={AdminDashboardStats,adminUsersTaskData,getallProjects,
  deleteProject,updateProject,deleteTask,editTask,changeProjectStatus,
  changeTaskStatus,deleteTaskFiles,getAllChats
}