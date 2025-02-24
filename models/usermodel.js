import mongoose from "mongoose";
const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'user name is required'],
            minlength:2,
            maxlength:50,
        },
        email:{
            type:String,
            required:[true,"email is required"],
            unquie:true,
            trim:true,
            lowerCase:true,
           //The regex /\S+@\S+\.\S+/ is a simple pattern to check for basic email formatting:
           // \S+ ensures there are non-whitespace characters before and after the @ symbol.
           // .\S+ ensures there is a domain part after the @.
            match:[/\S+@\S+\.\S+/,"please fill a valid email"],
        },
        password:{
            type: String,
            required:[true,"user password is required"],
            minlength:6,
        }
    },{timestamps:true}
)

const User = mongoose.model('User', userSchema);

export default User;