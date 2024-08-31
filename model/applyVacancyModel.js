import mongoose from "../connection/dbConfig.js";

var applyVacancy = mongoose.Schema({
    vacancy_id:{
        type:String,
        required:true
    },
    candidate_email:{
        type:String,
        required:true
    },
    recruiter_email:{
        type:String,
        required:true
    },
    post:{
        type:String,
        required:true
    },
    status_by_recruiter:{
        type:String,
        default:"Applied"
    }
});

export default mongoose.model("applyVacancySchema",applyVacancy,"apply_vacancy");