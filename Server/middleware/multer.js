const multer=require('multer');
const path=require('path');
const {ErrorHandler}=require('../utility/errorHandler')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        const uploadDir=path.join(__dirname,'..','Temp');
        return cb(null,uploadDir);
    },
    filename:function(req,file,cb){
        return cb(null,file.fieldname + "-"+ Date.now()+'-'+file.originalname)
    }
})

const multerUpload=multer({
    storage:storage,
    limits:{fileSize:1024*1024*30}
})

module.exports={multerUpload}