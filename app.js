const express = require("express");
const app = express();
const port = 3000;                                      
const web = require('./routes/web')
const connectDb = require('./db/connectDb')
const fileupload = require('express-fileupload')
const session = require('express-session');
const flash = require('connect-flash');
const cookieparser = require('cookie-parser');
app.use(cookieparser());
//html css set
app.set("view engine", "ejs");




//connect Db
connectDb()
//css image link
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));//it convert the user data into object; 

//message
app.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true,
}))

//flash message 
app.use(flash());

//file upload
app.use(fileupload({
    limit: { fileSize: 50 * 1024 * 1024 },
    useTempFiles : true
}));



app.use('/',web)

app.listen(port, () => {    
    console.log(`server chll rha hai ${port}`);
});