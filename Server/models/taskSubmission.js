const mongoose=require('mongoose');

const taskSubmissionSchema=mongoose.Schema({
    taskId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    files: [{
        filename:String,
        public_id: String,
        url: String
    }],
},{timestamps:true})

module.exports=mongoose.model('TaskSubmission',taskSubmissionSchema);