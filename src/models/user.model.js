import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userScehma=new Schema({ 
username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true
},

email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    
},
fullname:{
    type:String,
    required:true,
    trim:true,
    index:true,
},
avatar:{
    type:String,
    required:true,
    
},
coverImage:{
    type:String,
},
watchHistory:[{
    type:Schema.Types.ObjectId,
    ref:"Video"
}],
password:{
    type:String,
    required:[true,'Password is required'],
},

refreshToken:{
    type: String,
},






},

{
    timestamps:true,
}
)


userScehma.pre("save",async function(next){
if(this.isModified("password"))return next();

this.password=bcrypt.hash(this.password,10)
next()

})

userScehma.methods.isPasswordCorrect=async function(password) {
 return await   bcrypt.compare(password,this.password)
    
}

userScehma.methods.generateAccessToken=function(){
   return  jwt.sign(
    {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)

}
userScehma.methods.generateRefreshToken=function(){
    return  jwt.sign(
        {
            _id:this._id,
           
    
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    ) 
}

export  const User=mongoose.model("User",userScehma)
