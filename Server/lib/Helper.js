const userSocketIds=new Map();

const getSockets=(users)=>{
    console.log("haa error",users)
    return users.map((use)=>{
        console.log("jskdja",use)
        console.log("hai ki nahi",userSocketIds)
        const socketId=userSocketIds.get(use._id.toString() || use.toString());
        // console.log("Dhaga",socketId)
        return socketId
    })
    .filter((sock)=>sock)
};

module.exports={getSockets,userSocketIds}