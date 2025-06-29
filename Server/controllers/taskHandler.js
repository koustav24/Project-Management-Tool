const mongoose=require('mongoose')
const {tryCatcher,ErrorHandler}=require('../utility/errorHandler.js')
const Task=require('../models/Task.js');
const Project = require('../models/Projects.js');
const TaskSubmission=require('../models/taskSubmission.js');
const { uploadToCLoudinary, cloudinary } = require('../cloudinary/config.js');
const { emitEvent } = require('../utility/features.js');
const Notifications = require('../models/notifications.js');

const addTask=tryCatcher(async(req,res,next)=>{
    // projectTitle,piroA,dueDate,assignees,reminder,priority
    const {projectTitle,piroA,assignees,dueDate,reminder}=req.body;
    console.log("hii")
    console.log('ToSt',assignees)
    console.log("TOSt2",req.usero)
    const piro=await Project.findById(piroA);
    if(!piro){
        return next(new ErrorHandler("Project is not found to add the Task",404));
    }

    const newTask=await Task.create({
        title:projectTitle,projectId:piroA,assignedTo:assignees,deadline:dueDate,reminder,
        creator:req.usero
    })
    await newTask.save();

    piro.tasks.push(newTask._id);
    await piro.save();

    await Notifications.create({
        sender:req.usero.toString(),
        reciever:assignees,
        body:`New Task is Added to the ${piro.name}`
    })

    const totalAssignees=[...assignees];
    const assigneesObjectId = assignees.map(assignee => new mongoose.Types.ObjectId(assignee))

    emitEvent(req,"New_Task",assigneesObjectId,"New Task Added")

    res.status(201).json({success:true,msg:"Task Added Succesfully to Project"})

})

const editTask=tryCatcher(async(req,res,next)=>{
        const {taskId}=req.params;
        console.log("Kasyua")
        // projectTitle,piroA,assignees,dueDate,reminder
        const {projectTitle,description,piroA,assignees,dueDate,reminder}=req.body;
        console.log(taskId)

        const eTask=await Task.findById(taskId);
        if(!eTask){
            return next(new ErrorHandler("Task Not Found",404));
        }
        if(eTask.creator.toString() !== req.usero.toString()){
            return next(new ErrorHandler("You are Not Autherize to Edit ",404));
        }
        console.log('oo',eTask.creator.toString())
        console.log('ppl',req.usero.toString());
        

        eTask.title=projectTitle;
        eTask.description=description;
        eTask.projectId=piroA;
        eTask.assignedTo=assignees;
        eTask.deadline=dueDate;
        eTask.reminder=reminder;
        await eTask.save();
        res.status(200).json({ message: 'Task updated successfully',
            //  task: eTask 
            });

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
    if(tak.creator.toString() !== req.usero){
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

const getMyTask=tryCatcher(async(req,res,next)=>{
    
    if(req.admin ==="Admin"){
        const a=await Task.find({})
        .populate('projectId','name');

        const transformedTasks=a.map(({_id,title,projectId,status,creator,deadline})=>{
            const dueDate=new Date(deadline).toLocaleDateString('en-GB')
                            .replace(/\//g, "-")
            return {_id,title,projectId,status,creator,dueDate}
        })
        console.log('okat')
        return res.status(200).json({success:true,msg:"Succesfully fetched data",tasks:transformedTasks})

    }
    
    const u=await Task.find({assignedTo:req.usero})
                .populate('projectId','name')
                .populate('creator','name');
    
    const transformedData=u.map(({_id,title,projectId,status,creator,deadline})=>{
        const dueDate=new Date(deadline).toLocaleDateString('en-GB')
                        .replace(/\//g, "-")
        return {_id,title,projectId,status,
            creator: creator ? { _id: creator._id, name: creator.name } : null,
            dueDate}
    })

    // console.log(transformedData)

    res.status(200).json({success:true,msg:"Succesfully fetched data",tasks:transformedData})
})

const getProjectTask=tryCatcher(async(req,res,next)=>{
    console.log("kast")
    const {projectId}=req.body;
    const {q=1}=req.query
    console.log(projectId)
    const tasky=await Task.find({projectId:projectId})
                .select('-description')
                .populate('assignedTo','name')
                .sort({deadline:Number(q)})
    
    if(!tasky){
        return next(new ErrorHandler("Invalid Project Id",404))
    }

    res.status(200).json({success:true,msg:"Succesfully get the Task",tasks:tasky})
})

const getTaskDetails=tryCatcher(async(req,res,next)=>{
    const id=req.params.id
    if(!id){
        return next(new ErrorHandler("Check THe Routes please",404));
    }
    const t=await Task.findById(id)
            .populate("projectId",'name')
            .populate('creator','name')

    res.status(200).json({success:true,msg:"Successfully fetched The data",tusky:t})

})

const submitTask=tryCatcher(async(req,res,next)=>{
    const file=req.files;
    if(!file){
        return;
    }
    console.log(file);
    
    const {taskId}=req.body;
    console.log(taskId)
    const t=await Task.findById(taskId);
    if(!t){
        return next(new ErrorHandler("task not found",404))
    }

    if(!t.assignedTo.some(user=>user.toString()===req.usero.toString())){
        return next(new ErrorHandler("U dont have access TO submit the Task"));
    }
    const uploadedFiles=await uploadToCLoudinary(file)

        const ts=await TaskSubmission.create({
            taskId,
            submittedBy:req.usero,
            files:uploadedFiles
        })
        await ts.save();
        return res.status(201).json({msg:"files uploaded succesfully",files:uploadedFiles})
})

const getSubmittedTask=tryCatcher(async(req,res,next)=>{
    const {taskId}=req.params;

    const taskS=await TaskSubmission.find({taskId:taskId})
    if(!taskS){
        return next(new ErrorHandler("Task Id Not Found",404))
    }
    const totalFiles = taskS.reduce((count, task) => count + task.files.length, 0);

   const transformed = taskS.flatMap(task => 
        task.files.map(({ url,filename,public_id }) => ({ url,public_id }))
    );


    res.status(200).json({success:true,msg:"Successfully get the files",submittedTask:transformed,totalFiles})

})

const changeTaskStatus=tryCatcher(async(req,res,next)=>{
    const {taskId}=req.params;
    const {status}=req.body;
    console.log("tasky")

    if(!taskId){
        return next(new ErrorHandler("Please provide the Id"));
    }
    const t=await Task.findById(taskId);

    if(!t){
        return next(new ErrorHandler("Invalid Task"));
    }

    t.status=status
   await t.save();
    res.status(200).json({msg:"Succesfully submitted the status"})

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
    if(ts.submittedBy.toString() !== req.usero.toString()){
        return next(new ErrorHandler("You are not authorized to delete this file", 403));
    }

    const result = await cloudinary.uploader.destroy(public_id)
    
    if (result.result !== "ok") {
        return next(new ErrorHandler("Failed to delete file from Cloudinary", 500));
    }

    ts.files=ts.files.filter(f=>f.public_id !== public_id)
    await ts.save();
    // console.log("last2")
    res.status(200).json({ msg: "Image deleted successfully",result
         
    });

})


module.exports={addTask,getProjectTask,getMyTask,getTaskDetails,
    editTask,submitTask,getSubmittedTask,deleteTask,changeTaskStatus,
    deleteTaskFiles
}