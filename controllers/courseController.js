const CourseModel = require("../models/course");
const nodemailer = require("nodemailer");
class CourseController {
  static courseInsert = async (req, res) => {
    try {
      //console.log(req.body);
      const { _id } = req.userData;
      const { name, email, phone, dob, address, gender, education, course } =
        req.body;
      //   console.log(req.body);
      const data = await CourseModel.create({
        name,
        email,
        phone,
        dob,
        address,
        gender,
        education,
        course,
        user_id: _id,
      });
      this.sendEmail(name, email, course);
      res.redirect("/display");
    } catch (error) {}
  };

  static courseDisplay = async (req, res) => {
    try {
      const { id, name, image } = req.userData;
     // console.log(id);

      const data = await CourseModel.find({ user_id: id });
      //console.log(data);
      res.render("course/display", { d: data, n: name, i: image,title: ' course - MITS'  });
    } catch (error) {
      console.log(error);
    }
  };

  static courseUpdate = async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, phone, dob, address, gender, education, course } =
        req.body;

      const data = await CourseModel.findByIdAndUpdate(id, {
        name,
        email,
        phone,
        dob,
        address,
        gender,
        education,
        course,
      });
      res.redirect("/display");
    } catch (error) {
      console.log(error);
    }
  };

  static Edit = async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, image } = req.userData;

      const data = await CourseModel.findById(id);
      // console.log(data)
      res.render("course/edit", { d: data, n: name, i: image ,title: 'Edit course - MITS'  });
    } catch (error) {
      console.log(error);
    }
  };

  static courseView = async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, image } = req.userData;

      //console.log(id)
      const data = await CourseModel.findById(id);
      //console.log(data)
      res.render("course/view", { n: name, i: image, d: data, title: 'details  - MITS'  });
    } catch (error) {
      console.log(error);
    }
  };

  static courseDelete = async (req, res) => {
    try {
      const id = req.params.id;
      //console.log(id)
      const data = await CourseModel.findByIdAndDelete(id);
      //console.log(data)
      res.redirect("/display");
    } catch (error) {
      console.log(error);
    }
  };

  static sendEmail = async (name, email, course) => {
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
      subject: `course ${course}`, //subject line
      text: "hello", //plain text body
      html: `<b>${name}</b>course <b>${course}</b> insert successfully <br>`, //html body
    });
  };
}

module.exports = CourseController;
