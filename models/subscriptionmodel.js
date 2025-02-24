import mongoose from "mongoose";

const subscriptionSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"please enter the subscription name"],
            //the trim option is used to automatically remove leading and trailing whitespace from string values before they are saved to the database. 
            trim:true,
            minlength:2,
            maxlength:100,
        },
        price:{
            type:Number,
            required:[true ,"Subscription"],
            min:[0,"price must be greter the 0"]
        },
        currency:{
            type:String,
            enum :['usd','inr','eur'],
            default:'usd'
        },
        frequency:{
            type:String,
            enum:['daily','weekly','monthly','yearly']
        },
        category:{
            type:String,
            enum:['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
            required:true
        },
        paymentmethod:{
            type:String,
            required:true,
            trim:true
        },
        status:{
            type:String,
            enum:['active','cancelled','expired'],
            default:'active'
        },
        StartDate:{
            type:Date,
            required:true,
            validate:{
                validator:(v)=>v<=new Date(),
                message:"start data must be in past"
            }
        },
        renewalDate:{
            type:Date,
            validate:{
                validator:function(value){
                    return value > this.StartDate
                },
                message:"renewal date must be greater than startdate"
            }
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
            //setting index: true on a field in a Mongoose schema improves query performance for operations involving that field. (it makes improvements to the speed of queries by filtering and sorting documents based on the indexed field)
            index:true,
        }
    },{timestamps:true});

    subscriptionSchema.pre('save',
        function(next){
            if(!this.renewalDate){
                const renewalPeriods = {
                    daily: 1,
                    weekly: 7,
                    monthly: 30,
                    yearly: 365,
                  };
                
            this.renewalDate=new Date(this.StartDate)  // Clone the StartDate
            this.renewalDate.setDate(this.renewalDate.getDate()+renewalPeriods[this.frequency])
                }
            if(this.renewalDate < new Date()){ 
                this.status='expired';
            }
            next()       
        }
    )

    export const Subscription=mongoose.model("Subscription",subscriptionSchema)


