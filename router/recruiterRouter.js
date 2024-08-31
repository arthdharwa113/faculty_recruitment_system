import express from 'express';
import { registration,verifyEmail,login,logout,appliedCandidateList,updateStatus} from '../controller/recruiterController.js';
import {addVacancyForm,recruiterUpdatePassword,viewProfilePage,vacancyForm,deactivateAccount} from "../controller/recruiterController.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import recruiterModel from '../model/recruiterModel.js';

dotenv.config();
var recruiter_secret_Key = process.env.ADMIN_SECRET_KEY;

var recruiterRouter = express.Router();

recruiterRouter.use(express.static('public'));

const authenticateJWT = (request,response,next)=>{
    var token = request.cookies.recruiter_jwt;
    
    if(!token)
    response.render("recruiterlogin",{msg:""});

    else
    {
        jwt.verify(token,recruiter_secret_Key,(error,payload)=>{
            if(error)
            console.log("Error in recruiter login verify :",error);

            else
            {
                request.payload = payload;
                next();
            }
        });
    }
}

recruiterRouter.get("/recruiterlogin",authenticateJWT,(request,response)=>{
    response.render("recruiterhomepage",{email:request.payload._id});
});
recruiterRouter.get("/recruiterregistration",(request,response)=>{
    response.render("recruiterregistration",{msg:""});
});


recruiterRouter.get("/recruiterupdatepassword",authenticateJWT,(request,response)=>{
    response.render("recruiterupdatepassword",{email:request.payload._id,msg:""});
});
  

recruiterRouter.get("/vacancyform",authenticateJWT,vacancyForm);
recruiterRouter.get("/viewprofilepage",authenticateJWT,viewProfilePage);

recruiterRouter.get("/deactivateaccount",authenticateJWT,deactivateAccount)
recruiterRouter.get("/updatestatus",authenticateJWT,updateStatus);
recruiterRouter.get("/appliedcandidatelist",authenticateJWT,appliedCandidateList);
recruiterRouter.post("/vacancyform",authenticateJWT,addVacancyForm);
recruiterRouter.post("/registration",registration);
recruiterRouter.get("/verifyemail",verifyEmail);
recruiterRouter.post("/login",login);
recruiterRouter.get("/logout",logout);
recruiterRouter.post("/updatepassword",recruiterUpdatePassword);

export default recruiterRouter;