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
      extractedText: {
      type: String,
      default: "",
    },
    atsAnalysis:{
        atsScore:Number,
        missingKeywords:[String],
      weakBulletPoints: [String],
      formattingSuggestions: [String],
      projectSuggestions: [String],
    },
},
   {timestamps:true});

   export default mongoose.model('Resume',ResumeSchema);