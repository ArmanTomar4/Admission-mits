const mongoose = require('mongoose')
const Local_Url = 'mongodb://127.0.0.1:27017/ADMISSION_PORTAL'

const Live_url =
  "mongodb+srv://tomararman4:ram123@cluster0.u3uzo.mongodb.net/ADMISSION_PORTAL?retryWrites=true&w=majority&appName=Cluster0";
const connectDb = () => {
    return mongoose.connect(Live_url)
    .then(()=>{
        console.log("Db connect hogya hai")
    }).catch((error)=>{
        console.log (error)
    })
}

module.exports=connectDb;


