import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
{
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  role:{
    type:String,
    required:true
  },

  questions:[String],

  answers:[String],

  score:{
    type:Number,
    default:0
  },

  feedback:{
    type:String,
    default:""
  }
},
{
  timestamps:true
}
);

export default mongoose.model(
  "Interview",
  interviewSchema
);