// import mongoose,{Schema} from "mongoose";
// const tweetsSchema=new Schema({

// owner:{
//     type:Schema.Types.ObjectId,
//     ref:"User"
// },


// content:{
//     type:String,
//     required:true
// },




// },{timestamps:true})

// export const Tweets=mongoose.model("Tweets",tweetsSchema)

 import mongoose,{Schema} from "mongoose";

const tweetsSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    retweets: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
}, { timestamps: true });

export const Tweets = mongoose.model("Tweets", tweetsSchema);
