import express from "express"
import { PORT } from "./config/env.js"
import authRouter from "./routers/auth.router.js"
import userRouter from "./routers/user.router.js"
import SubscriptionRouter from "./routers/subscription.router.js"
import connecttodb from "./database/mongodb.js"
import ErrorMiddleware from "./middleware/Error.middleware.js"
import arcjetMiddleware from "./middleware/arcjet.middleware.js"
import workflowRouter from "./routers/workflow.router.js"
const app = express()
app.use(express.json())

app.use(arcjetMiddleware)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user',userRouter)
app.use('/api/v1/sub',SubscriptionRouter)
app.use('/api/v1/workflows',workflowRouter)
app.use(ErrorMiddleware)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, async() => {
  console.log(`app listening on port ${PORT}`)
  await connecttodb()
})