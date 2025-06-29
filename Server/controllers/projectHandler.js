const Project=require('../models/Projects.js');
const {tryCatcher,ErrorHandler}=require('../utility/errorHandler.js')
const Task=require('../models/Task');
const { uploadToCLoudinary } = require('../cloudinary/config.js');
const Chat=require('../models/chat.js');
const { emitEvent } = require('../utility/features.js');
const { mongoose } = require('mongoose');

const NewProject=tryCatcher(async(req,res,next)=>{
    const file=req.files;
    const {projectTitle,description,assignees,dueDate,creator}=req.body;
    
    const uploadFiles=await uploadToCLoudinary(file);

    const totalTeamMembers=[...assignees.toString()];

    const newP=await Project.create({
        name:projectTitle,
        description,
        creator,
        teamMembers:assignees,
        deadline:dueDate,
        projectFile:uploadFiles
    });

    const newGroup=await Chat.create({
        name:projectTitle,
        creator:req.usero,
        members:assignees
    })
    await newP.save();
    await newGroup.save();

    const NotifyMembers=assignees.map((r)=>new mongoose.Types.ObjectId(r))
    emitEvent(req,"New_Project",NotifyMembers,"New Project is Added")

    res.status(201).json({msg:"Project Created Succesfully",project:newP})
})

const editProject=tryCatcher(async(req,res,next)=>{
    const {projectId}=req.params;
    const {projectTitle,description,teamMembers,deadline}=req.body;

    const pd=await Project.findById(projectId)
    if(!pd){
        return next(new ErrorHandler("Project Not Found",404));
    }
    if(pd.creator.toString() !== req.usero.toString()){
        return next(new ErrorHandler("You are Not Autherize to Edit ",404));
    }
    
    pd.name = projectTitle || pd.name;
    pd.description = description || pd.description;
    pd.teamMembers = teamMembers || pd.teamMembers;
    pd.deadline = deadline ? new Date(deadline) : pd.deadline;

    await pd.save();
    res.status(200).json({ message: 'Project updated successfully', task: pd });
})

const DeleteProject=tryCatcher(async(req,res,next)=>{
    const {projectId}=req.params;
    console.log("projectId type:", typeof projectId, "value:", projectId); // 
    console.log("deler",projectId)
        if(!projectId){
            return next(new ErrorHandler("Task not Found",404));
        }
        const pk=await Project.findById(projectId);
        if(!pk){
            return next(new ErrorHandler("Project not Found",404));
        }
        if(pk.creator.toString() !== req.usero){
            return next(new ErrorHandler("You are nit autherize to delete that "))
        }

        await Task.deleteMany({_id:{$in: pk.tasks }})
    
        await Project.findByIdAndDelete(projectId)

        res.status(200).json({ message: 'Project and related tasks deleted successfully' })
})

const updateProject=tryCatcher(async(req,res,next)=>{
    console.log("update")
    const {projectId}=req.params;
    const {name,description,teamMembers}=req.body;

    // const projectUpdation=await Project.findByIdAndUpdate(projectId,{
    //     name,description,teamMembers
    // })
    const projectUpdation=await Project.findById(projectId);
    if(!projectUpdation){
        return next(new ErrorHandler("Project not Found",404))
    }

    if(projectUpdation.creator.toString() !== req.user.toString()  ){
        console.log(req.user);
        console.log(projectUpdation.creator)
        return next(new ErrorHandler("You are not kasu authorize to edit the project",403))
    }
    projectUpdation.name=name;
    projectUpdation.description=description;
    projectUpdation.teamMembers=teamMembers;

    res.status(200).json({msg:"Project updated Succesfully",project:projectUpdation})

})

const getMyProjects=tryCatcher(async(req,res,next)=>{

   
    const u=await Project.find({teamMembers:req.usero}).populate("creator","name")

    const transformedProject=u.map(({_id,name,creator,teamMembers,deadline})=>{
        const totalMembers=teamMembers.length
        return{
            _id,name,creator,totalMembers,deadline
        }
    })

    res.status(200).json({msg:"Succesfully fetched the Projects",
        Projects:transformedProject
    })
})

const getMyTeamMembers=tryCatcher(async(req,res,next)=>{
    const {projectId}=req.params;

    const tm=await Project.findById(projectId).populate(
        "teamMembers",
        "name profilePic"
    )
    if(!projectId){
        return next(new ErrorHandler("No Project or teamMates Found",404));
    }
    const transformedMsgs=tm.map(({_id,name,profilePic})=>{
        return{
            _id,name,profilePic
        }
    })

    return res.status(200).json({success:true,myTeamMembers:transformedMsgs})

})

const getProjectDetails=tryCatcher(async(req,res,next)=>{
    const {id}=req.params;
    if(!id){
        return next(new ErrorHandler("Check THe Routes please",404));
    }
    const pd=await Project.findById(id)
            .populate('teamMembers','name profilePic')

    res.status(200).json({msg:"Succesfully get Project Details",success:true,pDetails:pd})
})

const getProjectMembers=tryCatcher(async(req,res,next)=>{
    const {piroA}=req.body;
    console.log(piroA)
    const pm=await Project.findById(piroA).select('-creator -tasks -deadline').populate("teamMembers","name")
    res.status(200).json({success:true,msg:"Fetched the project members",members:pm})
})




module.exports={NewProject,updateProject,getMyProjects,getMyTeamMembers
    ,getProjectDetails,getProjectMembers,editProject,DeleteProject};