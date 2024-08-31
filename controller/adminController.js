import recruiterModel from "../model/recruiterModel.js";
import adminModel from "../model/adminModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import candidateModel from "../model/candidateModel.js";
import vacancyModel from "../model/vacancyModel.js";

dotenv.config();
const admin_secret_key = process.env.ADMIN_SECRET_KEY;

export const adminLoginController = async (request,response)=>{
    var obj = request.body;
    try{
        var expireTime = {
            expiresIn:'1d'
        }
        var token = jwt.sign({_id:request.body._id},admin_secret_key,expireTime);
    
    if(!token)
        response.render("index",{msg:"Error while setting up the token"});
    else{
        response.cookie("admin_jwt",token,{maxAge:24*60*60*1000,httpOnly:true});
       var adminEmail =  await adminModel.findOne({_id:request.body._id});
       //console.log("adminEmail : "+adminEmail); 
        if(adminEmail!=null){
            var adminPassword = await adminModel.findOne({_id:request.body._id},{password:1,_id:0});
            var status = bcrypt.compare(adminPassword.password,obj.password);            
            if(status)
                {
                    response.render("adminhomepage",{email:request.body._id});
                }
            else
                console.log("Error while admin Login");
        }
        else
        console.log("invalid email");
    }
    }catch(error){
        console.log("Error in admin login controller : ",error);
    }
}

export const adminViewRecruiterListController = async(request,response)=>{
    try{
        var res = await recruiterModel.find();

        console.log("adminViewRecruiter :",request.payload);
        response.render("adminviewrecruiterlist",{obj:res,email:request.payload._id});
    }
    catch(error)
    {
        console.log("Error :",error);
    }
}

export const adminVerifyRecruiter = async(request,response)=>{
    try{
            var res = await recruiterModel.updateOne({_id:request.query.email},{$set:{adminverify:"Verified"}});
            var res1 = await recruiterModel.find();

            response.render("adminviewrecruiterlist",{obj:res1,email:request.query.adminemail});
            console.log("admin verified status :",res);
    }
    catch(error)
    {
        console.log("Error in admin verified :",error);
    }
}

export const adminVerifyCandidate = async(request,response)=>{
    try{
            var res = await candidateModel.updateOne({_id:request.query.email},{$set:{adminverify:"Verified"}});
            var res1 = await candidateModel.find();

            response.render("adminviewcandidatelist",{obj:res1,email:request.query.adminemail});
            console.log("admin verified status :",res);
    }
    catch(error)
    {
        console.log("Error in admin verified :",error);
    }
}


export const logout = (request,response)=>{
    response.clearCookie("admin_jwt");

    response.render("adminlogin",{msg:"Logout Successfully"});
}

export const adminViewCandidateListController = async(request,response)=>{
    try{
        var res = await candidateModel.find();

        response.render("adminviewcandidatelist",{obj:res,email:request.payload._id});
    }
    catch(error)
    {
        console.log("Error in admin view candidate list catch :",error);
    }
}


export const adminUpdatePassword = async (request,response)=>{
    try{
        var obj = request.body;
        // console.log(obj);
       var admin= await adminModel.findOne({_id:obj.adminemail});
      console.log(admin)
       if(admin){
        if(admin.password == obj.admincurrentpassword){
            var res = await adminModel.updateOne({_id:obj.adminemail},{$set:{password:obj.adminupdatedpassword}});
       
            console.log("Data Updated Successfully");
            console.log(res);
            response.render("adminupdatepassword",{msg:"Password Updated Successfully",email:obj.adminemail},);
        }
        else{
            response.render("adminupdatepassword",{msg:"Your Current Password is wrong",email:obj.adminemail});
        }
       }
       else{
        response.render("adminupdatepassword",{msg:"Admin Not Found",email:""});
       }
       }
        
    catch(err)
    {
        console.log("Error :"+err);
    }
    }
  
   
export const vacancyList= async(request,response)=>{
    try{
        var res = await vacancyModel.find();

        response.render("vacancylist",{obj:res,email:request.payload._id});
    }
    catch(error)
    {
        console.log("Error vacancy list catch :",error);
    }
}