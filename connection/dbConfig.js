import mongoose from "mongoose";

var url = "mongodb+srv://root:root@cluster0.rdi6mv1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(url);

export default mongoose;