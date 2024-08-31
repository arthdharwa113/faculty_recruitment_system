import nodemailer from 'nodemailer';
const mailer = function(email,callback,data){
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user : "addharwa8944@gmail.com",
            pass: "widw sazf bddc tblo"
        }
    });
    const mailOption = {
        from : "addharwa8944@gmail.com",
        to : email,
        subject : "Verification mail",
        html : data
    }
    transporter.sendMail(mailOption,(err,info)=>{
        if(err)
            console.log("error in mailer ",err);
        else{
            console.log("Mail Sent from mailer");
            callback(info);
        }
    });
}
export default {mailer:mailer};