import Resume from '../models/Resume.js';
export const uploadResume=async(req,res)=>{
    try{
        const resume=await Resume.create({
            user:req.user._id,
            fileName:req.file.filename,
            fileUrl:req.file.path
        })
        res.status(201).json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}