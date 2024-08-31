import express from 'express';
import {registration,verifyemail,login,viewVacancy,applyVacancy,viewStatus,candidateUpdatePassword,viewProfilePage,logout,deactivateAccount} from "../controller/candidateController.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
var candidate_secret_key = process.env.ADMIN_SECRET_KEY;

var candidateRouter = express.Router();
candidateRouter.use(express.static('public'));

var authenticateJWT = (request,response,next)=>{
    var token = request.cookies.candidate_jwt;

    if(!token)
    response.render("candidatelogin",{msg:""});

    else
    {
        jwt.verify(token,candidate_secret_key,(error,payload)=>{
            if(error)
            {
                console.log("Error in authentication in candidate login :",error);
            }
            else
            {
                request.payload = payload;
                next();
            }
        });
    }
}

candidateRouter.get("/candidatelogin",authenticateJWT,(request,response)=>{
    response.render("candidatehomepage",{email:request.payload._id});
});


candidateRouter.get("/deactivateaccount",authenticateJWT,deactivateAccount);


candidateRouter.get("/candidateupdatepassword",authenticateJWT,(request,response)=>{
    response.render("candidateupdatepassword",{email:request.payload._id,msg:""});
});



candidateRouter.get("/candidateregistration",(request,response)=>{
    response.render("candidateregistration");
});



candidateRouter.get("/viewprofilepage",authenticateJWT,viewProfilePage);

candidateRouter.get("/logout",logout);

candidateRouter.get("/viewstatus",authenticateJWT,viewStatus);
candidateRouter.get("/applyvacancy",applyVacancy);
candidateRouter.get("/viewvacancy",authenticateJWT,viewVacancy);
candidateRouter.post("/registration",registration);
candidateRouter.get("/verifyemail",verifyemail);
candidateRouter.post("/login",login);
candidateRouter.post("/updatepassword",candidateUpdatePassword);

export default candidateRouter;