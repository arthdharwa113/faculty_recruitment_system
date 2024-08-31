import candidateModel from "../model/candidateModel.js";
import url from "url";
import bcrypt from "bcrypt";
import path from "path";
import mailer from "./mailer.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import vacancyModel from "../model/vacancyModel.js";
import applyVacancyModel from "../model/applyVacancyModel.js";


dotenv.config();
var candidate_secret_key = process.env.ADMIN_SECRET_KEY;

export const registration = async(request,response)=>{
    mailer.mailer(request.body._id,(info)=>{
        if(info)
        {
            var fileurl = url.fileURLToPath(import.meta.url);
        var dirname = path.dirname(fileurl).replace("\\controller","");

        console.log("dir :"+dirname);

        var filename = request.files.file;
        var fileName = new Date().getTime()+filename.name;

        var pathname = path.join(dirname,"/public/",fileName);
        filename.mv(pathname,async(err)=>{
            if(err)
            console.log("Error while uploading files :",err);

            else
            {
                try{
                    var obj = {
                        firstname:request.body.firstname,
                        lastname:request.body.lastname,
                        _id:request.body._id,
                        password:await bcrypt.hash(request.body.password,10),
                        gender:request.body.gender,
                        date:request.body.date,
                        address:request.body.address,
                        mobile:request.body.mobile,
                        qualification:request.body.qualification,
                        percentage:request.body.percentage,
                        experience:request.body.experience,
                        file:fileName
                    }
                    
                    var res = await candidateModel.create(obj);
                    
                    console.log("res :",res);
                    response.render("candidatelogin",{msg:"Registration Successfully"});
                }
                catch(error)
                {
                    console.log("Error in candidate file uploading catch :",error);
                }
            }
        });
        }
    },"Hello "+request.body._id+", This is verification mail please <a href='http://localhost:3000/candidate/verifyemail?email="+request.body._id+"'>Click This Link</a> for verification");
    }


export const verifyemail = async(request,response)=>{
    try{
        var res = await candidateModel.updateOne({_id:request.query.email},{$set:{emailverify:"Verified"}});

        console.log("res :",res);

        response.render("candidatelogin",{msg:"email verified successfully"});
    }
    catch(error)
    {
        console.log("Error in verify email catch :",error);
    }
}

export const login = async(request,response)=>{
    try{
        var expireTime = {
            expiresIn:"1d"
        }

        var token = jwt.sign({_id:request.body._id},candidate_secret_key,expireTime);

        if(!token)
        console.log("Error while creating token in candidate login");

        else
        {
            response.cookie("candidate_jwt",token,{maxAge:24*60*60*1000,httpOnly:true});

            var res = await candidateModel.findOne({_id:request.body._id,emailverify:"Verified",adminverify:"Verified"});

            console.log("res :"+res);
            if(res!=null)
            {
                var status = await bcrypt.compare(request.body.password,res.password);
                console.log(status);
                if(status)
                {
                    response.render("candidatehomepage",{email:request.body._id});
                }

                else
                {
                    response.render("candidatelogin",{msg:"you entered wrong password"});
                }
            }
            else
            {
                response.render("candidatelogin",{msg:"you entered wrong email id"});
            }
        }
    }
    catch(error)
    {
        console.log("Error in candidate login catch :",error);
    }
}

export const viewVacancy = async(request,response)=>{
    try{
        var res = await vacancyModel.find({});

        console.log("res :",res);
        
        response.render("candidateviewvacancy",{obj:res,email:request.payload._id});
    }
    catch(error)
    {
        console.log("Error in view vacancy catch :",error);
    }
}

export const applyVacancy = async(request,response)=>{
    try{
        var candidate_email = request.query.email;
        var vid = request.query.vid;

        var res = await vacancyModel.findOne({_id:vid},{email:1,post:1});

        var obj = {
            vacancy_id:res._id,
            post:res.post,
            candidate_email:candidate_email,
            recruiter_email:res.email,
        }
        var res1 = await applyVacancyModel.create(obj);
        console.log("res1 :",res1);

        var obj = await vacancyModel.find();
        response.render("candidateviewvacancy",{email:candidate_email,obj:obj});
    }
    catch(error)
    {
        console.log("Error in apply vacancy catch :",error);
    }
}

export const viewStatus = async(request,response)=>{
    try{
        var res = await applyVacancyModel.find({candidate_email:request.payload._id});
        
        response.render("viewcandidatestatus",{obj:res,email:request.payload._id});
    }
    catch(error)
    {
        console.log("Error in view status catch :",error);
    }
}



export const candidateUpdatePassword = async (request,response)=>{
    try{
        var obj = request.body;
        console.log(obj);
       var candidate= await candidateModel.findOne({_id:obj.candidateemail});
      console.log(candidate)
       if(candidate){
        var status = await bcrypt.compare(obj.candidatecurrentpassword,candidate.password);
        console.log(status);             
        if(status){
            var hashedpassword = await bcrypt.hash(obj.candidateupdatedpassword,10);
            var res = await candidateModel.updateOne({_id:obj.candidateemail},{$set:{password:hashedpassword}});
       
            console.log("Data Updated Successfully");
            console.log(res);
            response.render("candidateupdatepassword",{msg:"Password Updated Successfully",email:obj.candidateemail},);
        }
        else{
            response.render("candidateupdatepassword",{msg:"Your Current Password is wrong",email:obj.candidateemail});
        }
       }
       else{
        response.render("candidateupdatepassword",{msg:"Candidate Not Found",email:""});
       }
       }
        
    catch(err)
    {
        console.log("Error :"+err);
    }
    }
  
   
export const viewProfilePage = async(request,response)=>{
    try{
        var candidate = await candidateModel.findOne({ _id: request.payload._id });


        console.log("res :",candidate);
        
        response.render("candidateprofilepage",{obj:candidate,email:request.payload._id});
    }
    catch(error)
    {
        console.log("Error in view profile catch :",error);
    }
}


export const logout = (request,response)=>{
    response.clearCookie("candidate_jwt");

    response.render("candidatelogin",{msg:"Logout Successfully"});
}


export const deactivateAccount = async (request,response)=>{
    console.log(request.payload._id);
try{
    var res = await candidateModel.deleteOne({_id:request.payload._id});
console.log(res);
    response.render("candidatelogin",{msg:"Deativated Successfully"});
    response.clearCookie("candidate_jwt");
}catch(error){
console.log("Error while deactivating accout : ",error)
}
}
