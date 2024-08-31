import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import {adminLoginController} from '../controller/adminController.js'; 
import {adminViewRecruiterListController} from '../controller/adminController.js';
import {adminVerifyCandidate,adminVerifyRecruiter,vacancyList} from "../controller/adminController.js"
import {logout} from "../controller/adminController.js"
import { adminUpdatePassword } from '../controller/adminController.js';
import {adminViewCandidateListController} from '../controller/adminController.js';


var adminRouter = express.Router();

dotenv.config();
const admin_secret_key = process.env.ADMIN_SECRET_KEY;

const authenticateJWT = (request,response,next)=>{
    var token = request.cookies.admin_jwt;

    if(!token)
    response.render("adminlogin",{msg:""});

    else
    {
    jwt.verify(token,admin_secret_key,(error,payload)=>{
        if(error)
            console.log("error occured in admin authenticate jwt");
        else{
            console.log(payload);
            request.payload = payload;
            next();
        }
    });
}
}

adminRouter.use(express.static("public"));
adminRouter.get("/",authenticateJWT,(request,response)=>{
    response.render("adminhomepage",{email : request.payload._id});
});

adminRouter.get("/adminHomePage",authenticateJWT,(request,response)=>{
    response.render("adminhomepage",{email:request.payload._id});
});

adminRouter.get("/adminupdatepassword",authenticateJWT,(request,response)=>{
    response.render("adminupdatepassword",{msg:"",email:request.payload._id});
})

adminRouter.post("/login",adminLoginController);
adminRouter.get("/adminViewRecruiterList",authenticateJWT,adminViewRecruiterListController);
adminRouter.get("/adminverifyrecruiter",adminVerifyRecruiter);
adminRouter.get("/adminverifycandidate",adminVerifyCandidate);
adminRouter.get("/adminViewCandidateList",authenticateJWT,adminViewCandidateListController);
adminRouter.post("/updatepassword",adminUpdatePassword);
adminRouter.get("/vacancy",authenticateJWT,vacancyList);
adminRouter.get("/logout",logout);


adminRouter.get("/adminhomepage",authenticateJWT,(request,response)=>{
    response.render("adminhomepage");
})

export default adminRouter;