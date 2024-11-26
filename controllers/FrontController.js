const UserModel = require("../models/user");
const CourseModel = require("../models/course");
const bcrypt = require("bcrypt");
const e = require("connect-flash");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

// Configuration
cloudinary.config({
  cloud_name: "dclltwlph",
  api_key: "343467267116581",
  api_secret: "Lsbg3k9_0-AdITWFQvcmMG5Ti9Y", // Click 'View API Keys' above to copy your API secret
});

class FrontController {
  static home = async (req, res) => {
    try {
      const { name, image, email, id, role } = req.userData;
      const btech = await CourseModel.findOne({ user_id: id, course: "btech" });
      const bca = await CourseModel.findOne({ user_id: id, course: "bca" });
      const mca = await CourseModel.findOne({ user_id: id, course: "mca" });
      //console.log(btech)
      res.render("home", {
        n: name,
        e: email,
        i: image,
        btech: btech,
        bca: bca,
        mca: mca,
        r: role,
        title: "Home - MITS",
      });
      //console.log(name)
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name, image } = req.userData;
      res.render("about", {
        n: name,
        i: image,
        title: "About - MITS",
      });
    } catch (error) {
      console.log(error);
    }
  };
  static login = async (req, res) => {
    try {
      res.render("login", {
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", {
        message: req.flash("error"),
        msg: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, image } = req.userData;
      res.render("contact", {
        n: name,
        i: image,
        title: "Contact - MITS",
      });
    } catch (error) {
      console.log(error);
    }
  };
  static userInsert = async (req, res) => {
    try {
      //console.log(req.files);
      // const file = req.files.image;
      // const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
      //   folder: "profile"
      // });
      //console.log(imageUpload)
      const { n, e, p, cp } = req.body;

      const user = await UserModel.findOne({ email: e });
      if (user) {
        req.flash("error", "Email already exists");
        res.redirect("/register");
      } else {
        if (n && e && p && cp) {
          if (p == cp) {
            const file = req.files.image;
            const imageUpload = await cloudinary.uploader.upload(
              file.tempFilePath,
              {
                folder: "profile",
              }
            );
            const hashPassword = await bcrypt.hash(p, 10);
            const result = new UserModel({
              name: n,
              email: e,
              password: hashPassword,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url,
              },
            });
            const userdata = await result.save();
            if (userdata) {
              const token = jwt.sign(
                { ID: userdata._id },
                "huhihvfiheiheriheriber"
              );
              //console.log(token)
              res.cookie("token", token);
              this.sendVerifyEmail(n, e, userdata._id);
              req.flash(
                "success",
                "your registration is successful. Please check your email to verify your account."
              );
              res.redirect("/register");
            } else {
              req.flash("error", "not registered");
              res.redirect("/register");
            }
          } else {
            req.flash("error", "Password not matched");
          }
        } else {
          req.flash("error", "All fields are required");
          res.redirect("/register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  static verifylogin = async (req, res) => {
    try {
      //console.log(req.body)
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          if (user.role == "admin" && user.is_verified == 1) {
            //token
            const token = jwt.sign({ ID: user._id }, "huhihvfiheiheriheriber");
            //console.log(token);
            res.cookie("token", token);
            //admin login
            res.redirect("/admin/dashboard");
          } else if (user.role == "user" && user.is_verified == 1) {
            const token = jwt.sign({ ID: user._id }, "huhihvfiheiheriheriber");
            //console.log(token);
            res.cookie("token", token);
            res.redirect("/home");
          } else {
            req.flash("error", "please verify ur email");
            res.redirect("/");
          }
        } else {
          req.flash("error", "Email or Password is not valid");
          res.redirect("/");
        }
      } else {
        req.flash("error", "User not found");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static changePassword = async (req, res) => {
    try {
      const { id } = req.userData;
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "password doesn't match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "password updated successfully");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "All fields are required");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  static profile = async (req, res) => {
    try {
      const { name, image, email } = req.userData;
      res.render("profile", {
        n: name,
        i: image,
        e: email,
        title: "Profile - MITS",
      });
    } catch (error) {
      console.log(error);
    }
  };
  static updateProfile = async (req, res) => {
    try {
      const { name, email } = req.body;
      const { id } = req.userData;

      // Find the user from the database
      const user = await UserModel.findById(id);

      // Create a data object to store updated fields
      let data = { name, email };

      if (req.files) {
        const imageID = user.image.public_id;
        //console.log(imageID);

        // Destroying the previous image
        await cloudinary.uploader.destroy(imageID);

        // New image upload
        const imagefile = req.files.image;
        const imageUpload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );

        // Adding image data to the update object
        data.image = {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        };
      }

      // Update user details in the database
      await UserModel.findByIdAndUpdate(id, data);
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };
  static forgetPasswordVerify = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await UserModel.findOne({ email: email });
      //console.log(userData)
      if (userData) {
        //npm i randomstring
        const randomString = randomstring.generate(7);
        //console.log(randomString);
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        req.flash("success", "Plz Check Your mail to reset Your Password!");
        res.redirect("/");
      } else {
        req.flash("error", "You are not a registered Email");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static sendEmail = async (name, email, token) => {
    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "tomararman4@gmail.com",
        pass: "tlmyhamzwxdnndwa",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "hello", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/reset-password?token=' +
        token +
        '">Reset</a>Your Password.',
    });
  };
  // static updateProfile = async (req, res) => {
  //   try {
  //     const {name,email,image} = req.body;
  //     const {id} = req.userData;
  //     if (req.files) {
  //       const user = await UserModel.findById(id);
  //       const imageID = user.image.public_id;
  //       console.log(imageID);
  //       //destroying previous image
  //       await cloudinary.uploader.destroy(image);
  //       //new image upload
  //       const imagefile = req.files.image;
  //       const imageUpload = await cloudinary.uploader.upload(
  //         imagefile.tempFilePath,
  //         {
  //           folder : "userprofile",
  //         }
  //       );
  //       var data = {
  //         name:name,
  //         email:email,
  //         image:{
  //           public_id:imageUpload.public_id,
  //           url:imageUpload.secure_url
  //         }
  //       }
  //     } else {

  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  static reset_Password = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        res.render("reset-password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  static sendVerifyEmail = async (name, email, user_id) => {
    //console.log(name, email, user_id);
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "tomararman4@gmail.com",
        pass: "tlmyhamzwxdnndwa",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "For Verification mail", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/verify?id=' +
        user_id +
        '">Verify</a>Your mail</p>.',
    });
    //console.log(info);
  };
  static verifyMail = async (req, res) => {
    try {
      const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
        is_verified: 1,
      });
      if (updateinfo) {
        res.redirect("/home");

      }
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = FrontController;
