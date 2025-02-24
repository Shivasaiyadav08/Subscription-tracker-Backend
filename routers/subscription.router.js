import {Router} from 'express'
import authorize from '../middleware/auth.middleware.js'
import { CreateSubscription, getUserSubscription } from '../controllers/subscription.controller.js'

const SubscriptionRouter=Router()


SubscriptionRouter.get("/",)
SubscriptionRouter.get("/:id",authorize,getUserSubscription)
SubscriptionRouter.post("/",authorize,CreateSubscription)
SubscriptionRouter.put("/:id",(req,res)=>{
    res.send({title:"update subscription"})
})
SubscriptionRouter.delete("/:id",(req,res)=>{
    res.send({title:"Delete subscription"})
})
SubscriptionRouter.get("/user/:id",(req,res)=>{
    res.send({title:"GET all user subscription"})
}) 
SubscriptionRouter.put("/:id/cancel",(req,res)=>{
    res.send({title:"cancel subscription"})
})
SubscriptionRouter.get("upcoming",(req,res)=>{
    res.send({title:"get upcoming subscription"})
})


export default SubscriptionRouter;