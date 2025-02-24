import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/usermodel.js"
import { JWT_SECRET } from "../config/env.js"
import { JWT_EXPIRE_IN } from "../config/env.js"

export const signup=async(req,res,next)=>{
    //This creates a session object, which is like a "context" for grouping a series of database operations. Think of it as opening a "safe workspace" where changes won't be permanent until you explicitly save them.
    const session=await mongoose.startSession();
    session.startTransaction();
    try{
        const {name,email,password}= req.body
        const existingUser=await User.findOne({email});
        if(existingUser){
            const error=new Error('User already exists ')
            error.statusCode=409
            throw error
        }
   // hash password before saving it to the database, never store passwords in plain text
        const salt =await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(password,salt)

        const newUsers=await User.create([
        {
            name:name,
            email:email,
            password:hashPassword
        }
        ],{session})
   //generating a JWT (JSON Web Token), which is a string that identifies the user. This token is sent to the client, and the client sends it back with every request to the server. This way, the server can identify the user without having to store the user's information in memory.
   //A secret key (JWT_SECRET) used to sign the token. It ensures the token is secure and can only be verified by the server that created it.
   //It sets an expiration time for the token, improving security by limiting its validity period.

        const token=jwt.sign({ userId:newUsers[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRE_IN})
//This commits the transaction, meaning all the changes (like inserts, updates, or deletes) made during the transaction are permanently saved to the database.
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success:true,
            message:"user crested successfully",
            data:{
              token,
              user:newUsers[0]
            }
        })
    }catch(error){
        //The session.abortTransaction() method is used in MongoDB transactions to cancel all changes made during the transaction. 
   await session.abortTransaction();
   session.endSession
   next(error)
    }
}

export const signin=async(req,res,next)=>{
    try{

        const {email,password}=req.body
        const user=await User.findOne({email});
        if(!user ){
            const error=new Error("User not Found")
            error.statusCode=404;
            throw ErrorEvent;
        }
        // to confrim thw password
        const isPasswordValid=await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
           const error=new Error("Invalid Password")
           error.statusCode=401
           throw error
        }
        const token =jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRE_IN})
    
        res.status(200).json({
            Success:true,
            message:"signin completed",
            token,
            user
        })
    } catch(error){
    next(error)
}
}