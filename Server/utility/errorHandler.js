class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode
    }
}

const tryCatcher=(func)=>async(req,res,next)=>{
    try {
        await func(req,res,next)
    } catch (error) {
        next(error)
    }
}

const ErrorMiddleware=(err,req,res,next)=>{
    err.message=err.message || "Internal Server Error";
    err.statusCode=err.statusCode || 500;

    return res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}


module.exports={ErrorHandler,tryCatcher,ErrorMiddleware}