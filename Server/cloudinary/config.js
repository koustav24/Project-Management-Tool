const cloudinary=require('cloudinary').v2;
const {ErrorHandler}=require('../utility/errorHandler')

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_api_key,
    api_secret:process.env.CLOUDINARY_api_secret
})

const uploadToCLoudinary=async(files)=>{
    const UploadPromises=files.map((fil)=>{
        return new Promise((resolve,reject)=>{
            console.log(fil.path);
            cloudinary.uploader.upload(
                fil.path,{
                    resource_type:"auto",
                    public_id:Date.now()
                },(error,result)=>{
                    if(error) return reject(error)
                    resolve({...result,original_filename:fil.originalname})
                }
            )
        })
    })

    try {
        const result=await Promise.all(UploadPromises);
        const formattedResults=result.map((e)=>({
            public_id:e.public_id,
            url:e.secure_url,
            filename:e.original_filename
        }))
        return formattedResults;
    } catch (error) {
        console.error("Once again Error uploading files:", error)
        throw new ErrorHandler("Error Uploading Files to CLoudinary")
    }


}

module.exports={cloudinary,uploadToCLoudinary}