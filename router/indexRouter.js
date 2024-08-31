import express from 'express';
var indexRouter = express.Router();
indexRouter.use(express.static('public'));

indexRouter.get("/",(request,response)=>{
    response.render("index");
});


indexRouter.get("/homepage",(request,response)=>{
    response.render("index");
});

indexRouter.get("/aboutpage",(request,response)=>{
    response.render("about");
});


indexRouter.get("/servicespage",(request,response)=>{
    response.render("services");
});


indexRouter.get("/contactpage",(request,response)=>{
    response.render("contact");
});



export default indexRouter;