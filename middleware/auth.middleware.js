
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.js";
import User from "../models/usermodel.js";

const authorize= async(req ,res,next)=>{
    try{ 
        let token;
        //to extract a Bearer token from an HTTP request's Authorization header, which is commonly used in APIs for authentication.
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token=req.headers.authorization.split(' ')[1]
        }
        if(!token){
            return res.status(401).json({message:"unauthorized"})
        }
        const decode=jwt.verify(token,JWT_SECRET)
        //The findById method queries the database to find the user associated with the decoded userId.
        const user=await User.findById(decode.userId)
        if(!user){
            return res.status(401).json({message:"unauthorized"}) 
        }
        req.user=user
        next()

    }catch(error){
      res.status(401).json({ message: 'Unauthorized', error: error.message })
    }
}

export default authorize