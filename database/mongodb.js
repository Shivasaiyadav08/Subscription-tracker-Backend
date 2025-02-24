import mongoose from "mongoose";

import { DB_URI,NODE_ENV } from "../config/env.js";

if(!DB_URI){
    throw new ("please define mongodb uri env variable")
}

const connecttodb=async()=>{
    try{
        //connect to the database using the uri provided from the .env file which is stored in the DB_URI variable in .development or .production file
        await mongoose.connect(DB_URI);
        //the NODE_ENV is development or production depending on the environment the app is running
        console.log("connected to db in "+NODE_ENV)
    }catch(err){
        console.error(err)
        //The process.exit(1) call terminates the application if a connection fails.
        process.exit(1)
    }
}

export default connecttodb