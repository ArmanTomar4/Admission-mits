const UserModel = require("../../models/user");
const CourseModel = require("../../models/course");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
// Configuration
cloudinary.config({
  cloud_name: "dclltwlph",
  api_key: "343467267116581",
  api_secret: "Lsbg3k9_0-AdITWFQvcmMG5Ti9Y", // Click 'View API Keys' above to copy your API secret
});
class AdminController {
  static dashboard = async (req, res) => {
    try {
      const { name, image } = req.userData;
      res.render("admin/dashboard", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static display = async (req, res) => {
    try {
      const { name, image } = req.userData;
      const data = await UserModel.find();
      //console.log(data)
      res.render("admin/display", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static adduser = async (req, res) => {
    try {
      const { name, image } = req.userData;
      res.render("admin/adduser",{ n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static CourseView = async (req, res) => {
    try {
      const { name, image } = req.userData;
      const id = req.params.id;
      //console.log(id)
      const data = await CourseModel.findById(id);
      console.log(data);
      res.render("admin/course/view", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static viewUser = async (req, res) => {
    try {
      const { name, image } = req.userData;
      const id = req.params.id;
      //console.log(id)
      const data = await UserModel.findById(id);
      console.log(data);
      res.render("admin/viewUser", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static editUser = async (req, res) => {
    try {
      const id = req.params.id;
      //console.log(id)
      const data = await UserModel.findById(id);
      // console.log(data)
      res.render("admin/editUser", { d: data });
    } catch (error) {
      console.log(error);
    }
  };
  static updateUser = async (req, res) => {
    try {
      const id = req.params.id;
      const { n, p, e } = req.body;
      console.log(req.body);
      console.log(id);
      const data = await UserModel.findByIdAndUpdate(id, {
        name: n,
        email: e,
        password: p,
      });
      // console.log(data)
      res.redirect("/admin/displayUser"); //route
    } catch (error) {
      console.log(error);
    }
  };
  static courseDelete = async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      const Cdata = await CourseModel.findByIdAndDelete(id);
      // console.log(data)
      res.redirect("/admin/courseDisplay"); //route
    } catch (error) {
      console.log(error);
    }
  };
  static deleteUser = async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      const data = await UserModel.findByIdAndDelete(id);
      // console.log(data)
      res.redirect("/admin/displayUser"); //route
    } catch (error) {
      console.log(error);
    }
  };
  static userInsert = async (req, res) => {
    try {
      console.log(req.body);
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "profile",
      });
      const { n, e, p } = req.body;
      const result = new UserModel({
        name: n,
        email: e,
        password: p,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });
      await result.save();
      res.redirect("/admin/displayUser"); //route ka url h
    } catch (error) {
      console.log(error);
    }
  };
  static courseDisplay = async (req, res) => {
    try {
      const { name, image } = req.userData;
      const Cdata = await CourseModel.find();
      //console.log(Cdata)
      res.render("admin/course/display", { d: Cdata, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static countFormSubmissions = async (req, res) => {
    try {
      // Count the number of students in the database
      const studentCount = await Student.countDocuments({ formFilled: true });

      // Return the count to the client
      return res.status(200).json({
        success: true,
        message: `Total students who filled the form: ${studentCount}`,
        count: studentCount,
      });
    } catch (error) {
      // Handle errors
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error. Unable to count form submissions.",
      });
    }
  };
  static statusUpdate = async (req, res) => {
    try {
      const {name,email,status,comment} = req.body;
      const id = req.params.id;
      this.sendEmail(name,email,status,comment);
      await  CourseModel.findByIdAndUpdate(id,{
        status:status,
        comment:comment
      });
      res.redirect("/admin/courseDisplay")
    } catch (error) {
      console.log(error);
    }
  };
  static sendEmail = async (name, email,status ,comment) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "tomararman4@gmail.com",
        pass: "tlmyhamzwxdnndwa",
      },
    });

    let info = await transporter.sendMail({
      from: "test@gmail.com", //sender address
      to: email, //list of receivers
      subject: `status${status}`, //subject line
      text: "hello", //plain text body
      html: `<b>${name}</b> course <b>${status}</b> successfully <br>
      <b>Comment from Admin</b> <br> ${comment}`, //html body
    });
  };
}
module.exports = AdminController;
