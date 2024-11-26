const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({

    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    image:{
        public_id:{
            type:String,
            require:true,
        },
        url:{
            type:String,
            require:true,
        }
    },
    token:{
    type:String
    },
    is_verified:{
        type:Number,
        default:0
    },
    role:{
        type:String,
        default:'user'
    },
},{timestamps:true})

const UserModel  = mongoose.model('user',UserSchema)
module.exports = UserModel


// const mongoose= require('mongoose')
// const UserSchema= mongoose.Schema({
//     name:{
//         type:String,
//         require:true,
//     },
//     email:{
//         type:String,
//         require:true,

//     },
//     password:{
//         type:String,
//         require:true,

//     },
//     cp:{
//         Required:true,
//     },
     //database connect for image
//     image:{
//        public_id:{
//         type:String,
//         Required:true,
//        },
//        url:{
//         type:String,
//         Required:true
//        }
//     },
//     role:{
//         type:String,
//         default:'user'
//     },
// },{timestamps:true})
// const userModel= mongoose.model('user',UserSchema)
// module.exports = userModel;