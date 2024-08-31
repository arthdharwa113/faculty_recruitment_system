import recruiterModel from "../model/recruiterModel.js";
import mailer from './mailer.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import vacancyModel from "../model/vacancyModel.js";
import applyVacancyModel from "../model/applyVacancyModel.js";
import candidateModel from "../model/candidateModel.js";

dotenv.config();
const recruiter_secret_key = process.env.ADMIN_SECRET_KEY;
export const registration = async (request,response)=>{
    var res = await recruiterModel.findOne({_id:request.body._id});
    // console.log("result",res);
    if(res==null){
    try{
        var obj = request.body;
        var obj = {
            name:request.body.name,
            recruiter:request.body.recruiter,
            _id:request.body._id,
            password: await bcrypt.hash(request.body.password,10),
            contact:request.body.contact,
            address:request.body.address
        }
       
        mailer.mailer(request.body._id,async(info)=>{
            if(info){
                console.log("Mail sent from controller message");
                var res = await recruiterModel.create(obj);
                console.log(res);
                console.log("data inserted successfully : "+res);        
                response.render("recruiterlogin",{msg:"Mail sent successfully | Please Verify"});
            }
        },"Hello "+request.body._id+", This is verification mail please <a href='http://localhost:3000/recruiter/verifyemail?email="+request.body._id+"'>Click This Link</a> for verification");
    }catch(error){
        console.log("error occured");
    }
}
else{
    response.render("recruiterregistration",{msg:"Email Already Exists"})
}
};

export const verifyEmail = async(request,response)=>{
    try{
        var email = request.query.email;
        var verifyEmailStatus = {
            $set : {
                emailverify : "Verified"
            }
        }
        var res = await recruiterModel.updateOne({_id:email},verifyEmailStatus);
        console.log("After verify : ",res);
        response.render("recruiterlogin",{msg:"Email Verified Successfully"});
    }catch(err){
        console.log("Error in emailVerify : "+err);
    }
}

export const login = async(request,response)=>{
    try{
        const {_id,password} = request.body;

        console.log("obj :",request.body);
        var expireTime = {
            expiresIn:"1d"
        }

        var token = jwt.sign({_id:_id},recruiter_secret_key,expireTime);

        if(!token)
        console.log("Error while generating token in recruiter login");

        else
        {
            response.cookie("recruiter_jwt",token,{maxAge:24*60*60*1000,httpOnly:true});

            var recruiterLogin = await recruiterModel.findOne({_id:request.body._id,emailverify:"Verified",adminverify:"Verified"});

            if(recruiterLogin!=null)
            {
                var status = bcrypt.compare(request.body.password,recruiterLogin.password);

                if(status)
                response.render("recruiterhomepage",{email:request.body._id});

                else
                response.render("recruiterlogin",{msg:"Error while comparing password"});
            }
            else
            {
                response.render("recruiterlogin",{msg:"you entered either wrong email or not verify by admin and you don't verify your email"});
            }
        }
    }
    catch(error)
    {
        console.log("Error in recruiter login :",error);
    }
}

export const logout = (request,response)=>{
    response.clearCookie("recruiter_jwt");

    response.render("recruiterlogin",{msg:"Logout Successfully"});
}

export const addVacancyForm = async(request,response)=>{
    try{
        var res = await vacancyModel.create(request.body);
        console.log("res :",res);
        var obj =  await recruiterModel.findOne({ _id: request.payload._id });

        response.render("vacancyform",{email:request.payload._id,msg:"Vacancy Added Successfully",obj:obj});
    }
    catch(error)
    {
        console.log("Error in add vacancy catch :",error);
    }
}

export const appliedCandidateList = async(request,response)=>{
    try{
        var res = await applyVacancyModel.find();

        var arr = [];
        for(var index in res)
        {
            var res1 = await candidateModel.findOne({_id:res[index].candidate_email});
            arr.push(res1.file);  //arr = [...arr,res1.file]
        }

        console.log(arr);
        response.render("appliedcandidatelist",{obj:res,email:request.payload._id,arr:arr});
    }
    catch(error)
    {
        console.log("Error in apply candidate list")
    }
}

export const updateStatus = async(request,response)=>{
    try{
        const {candidate_email,vid} = request.query;

        var updateData = {$set:{status_by_recruiter:"Shortlist"}}

        await applyVacancyModel.updateOne({vacancy_id:vid,candidate_email:candidate_email},updateData);

        var res = await applyVacancyModel.find();

        var arr = [];
        for(var index in res)
        {
            var res1 = await candidateModel.findOne({_id:res[index].candidate_email});
            arr.push(res1.file);
        }

        response.render("appliedcandidatelist",{obj:res,email:request.payload._id,arr:arr});

    }
    catch(error)
    {
        console.log("Error in update status catch :",error);
    }
}


    
export const recruiterUpdatePassword = async (request,response)=>{
    try{
        var obj = request.body;
        console.log(obj);
       var recruiter= await recruiterModel.findOne({_id:obj.recruiteremail});
      console.log(recruiter)
       if(recruiter){
        var status = await bcrypt.compare(obj.recruitercurrentpassword,recruiter.password);
        console.log(status);             
        if(status){
            var hashedpassword = await bcrypt.hash(obj.recruiterupdatedpassword,10);
            var res = await recruiterModel.updateOne({_id:obj.recruiteremail},{$set:{password:hashedpassword}});
       
            console.log("Data Updated Successfully");
            console.log(res);
            response.render("recruiterupdatepassword",{msg:"Password Updated Successfully",email:obj.recruiteremail},);
        }
        else{
            response.render("recruiterupdatepassword",{msg:"Your Current Password is wrong",email:obj.recruiteremail});
        }
       }
       else{
        response.render("recruiterupdatepassword",{msg:"Recruiter Not Found",email:""});
       }
       }
        
    catch(err)
    {
        console.log("Error :"+err);
    }
    }
  
   
 
    export const viewProfilePage = async(request,response)=>{
        try{
            var recruiter = await recruiterModel.findOne({ _id: request.payload._id });
    
    
            console.log("res :",recruiter);
            
            response.render("recruiterprofilepage",{obj:recruiter,email:request.payload._id});
        }
        catch(error)
        {
            console.log("Error in view profile catch :",error);
        }
    }
  
  
   
 
    export const vacancyForm = async(request,response)=>{
        var obj =  await recruiterModel.findOne({ _id: request.payload._id });
        response.render("vacancyform",{email:request.payload._id,obj:obj,msg:""})
    }

    
export const deactivateAccount = async (request,response)=>{
    console.log(request.payload._id);
try{
    var res = await recruiterModel.deleteOne({_id:request.payload._id});
console.log(res);
response.clearCookie("recruiter_jwt");
    response.render("recruiterlogin",{msg:"Deativated Successfully"});
    
}catch(error){
console.log("Error while deactivating accout : ",error)
}
}

