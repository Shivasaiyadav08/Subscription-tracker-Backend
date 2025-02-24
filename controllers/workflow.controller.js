import {createRequire} from "module"
const require=createRequire(import.meta.url)
import {Subscription} from "../models/subscriptionmodel.js"
const { serve}=require("@upstash/workflow/express")
import { sendReminderEmail } from "../utils/send.email.js"
import dayjs from "dayjs"
const REMINDERS=[7,5,3,1]

export const sendReminder=serve(async(context)=>{
    //extract the subscriptionId from the request payload
    //context.requestPayload is an object that contains the data sent to the workflow when it was triggered.
    const {subscriptionId}=context.requestPayload

    const subscription=await fetchSubscription(context,subscriptionId);
    if(!subscription || subscription.status!=='active'){
        return;
    }

    const renewalDate=dayjs(subscription.renewalDate);
    
    if(renewalDate.isBefore(dayjs())){
        console.log(`Subscription ${subscriptionId} renewal day is passed`);
        return;
    }
    for( const daysBefore of REMINDERS){
        //calculate the reminder date by subtracting the daysBefore value from the renewalDate
        //unit: The unit of time to subtract (e.g., "day")
        const reminderDate=renewalDate.subtract(daysBefore,"day");
        if(reminderDate.isAfter(dayjs())){
            await sleepUntilReminder(context,`Reminder ${daysBefore} days before`,reminderDate);
        }
        await triggerReminder(context,`${daysBefore} days before reminder`,subscription);
    }
})

const triggerReminder=async(context,label,subscription)=>{
    
    return await context.run(label,async()=>{
        console.log(`Triggering ${label} `);
        await sendReminderEmail({
            to:subscription.user.email,
            type:label,
            subscription:subscription
           
        })
    })
}

const fetchSubscription=async(context,subscriptionId)=>{
    return await context.run('getSubscription',async ()=>{
        //fetch the subscription from the database using the subscriptionId
        return Subscription.findById(subscriptionId).populate('user','name email');
    })
}

const sleepUntilReminder=async(context,label,reminderDate)=>{
   console.log(`Sleeping until ${label} ${reminderDate}`);
   //sleepUntil: Pauses the workflow execution until the specified date and time.
   await context.sleepUntil(label,reminderDate.toDate());
}
