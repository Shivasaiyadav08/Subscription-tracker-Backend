
import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import transporter, { accountEmail } from "../config/nodemailer.js";

export const sendReminderEmail = async({to,type,subscription})=> {
    if(!to || !type ){
        throw new Error("Missing parameters");
    }
    //from the emailTemplates array, find the template that matches the type parameter
    const template=emailTemplates.find((t)=>t.label===type);
    if(!template) throw new Error("Invalid type");

    const mailInfo={
        userName:subscription.user.name,
        subscriptionName:subscription.name,
        renewalDate:dayjs(subscription.renewalDate).format("MMMM DD, YYYY"),
        planName:subscription.name,
        price:`${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod:subscription.paymentmethod,
    }
//generate the email body and subject using the template's generateBody and generateSubject functions
const message=template.generateBody(mailInfo);
const subject=template.generateSubject(mailInfo);
const mailOptions={
    from:accountEmail,
    to:to,
    subject:subject,  
    html:message,
}
//send the email using the transporter's sendMail method
 transporter.sendMail(mailOptions,(error,info)=>{
     if(error){
         return console.log("error sending mail");
     }
     //log the response from the sendMail method
         console.log(`Email sent: ${info.response}`);
     
 })
}