import User from "../models/usermodel.js"

export const getUsers=async(req ,res,next)=>{
    try{
       const Users=await User.find();
       res.status(200).json({
        success:true,
        data:Users
       })

    }catch(error){
        next(error)
    }
}
export const getUser=async(req ,res,next)=>{
    try{
       const user=await User.findById(req.params.id).select("-password")
       if(!user){
        const error=new Error("User not found")
        error.statusCode=400
        throw error
       }
       res.status(200).json({
        success:true,
        data:user
       })

    }catch(error){
        next(error)
    }
}