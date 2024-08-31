import mongoose from "../connection/dbConfig.js";

var candidate = mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    _id:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true,
        default:"male"
    },
    date:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    percentage:{
        type:String,
        required:true
    }
    ,
    experience:{
        type:String,
        required:true
    },
    file:{
        type:String,
        required:true
    }
    ,
    adminverify:{
        type:String,
        default:"Not Verified",
        required:true
    },
    emailverify:{
        type:String,
        default:"Not Verified",
        required:true
    },
    status:{
        type:Boolean,
        default:true,
        required:true
    }
});

export default mongoose.model("candidateSchema",candidate,"candidate");