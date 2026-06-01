import mongoose from 'mongoose';

const ResumeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    fileName:{
        type:String,
        required:true
    },
    fileUrl:{
        type:String,
        required:true
    },
},
   {timestamps:true});

   export default mongoose.model('Resume',ResumeSchema);