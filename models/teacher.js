const mongoose  = require('mongoose')
const TeacherSchema = mongoose.Schema({

    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    city:{
        type:String,
        default:'user'
    },
},{timestamps:true})

const TeacherModel  = mongoose.model('Teacher',TeacherSchema)
module.exports = TeacherModel