import {Router} from 'express'
import { getUser, getUsers } from '../controllers/user.controller.js'
import authorize from '../middleware/auth.middleware.js'

const userRouter=Router()


userRouter.get("/",getUsers)
userRouter.get("/:id",authorize,getUser)
userRouter.post("/",(req,res)=>{
    res.send({title:"add"})
})
userRouter.put("/:id",(req,res)=>{
    res.send({title:"update"})
})
userRouter.delete("/:id",(req,res)=>{
    res.send({title:"delete"})
})


export default userRouter;