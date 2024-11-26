const express = require("express");
const route = express.Router();
const checkAuth = require("../middleware/checkAuth");
const FrontController = require("../controllers/FrontController");
const AdminController = require("../controllers/admin/AdminController");
const CourseController = require("../controllers/courseController");

// route.get("/", (req, res) => {
//     res.send("Hello World!");
// });

// route.get("/about", (req, res) => {
//     res.send("bibbo jaan");
// });
route.get("/home", checkAuth, FrontController.home);
route.get("/about", checkAuth, FrontController.about);
route.get("/", FrontController.login);
route.get("/register", FrontController.register);
route.get("/contact", checkAuth, FrontController.contact);
route.post("/userInsert", FrontController.userInsert);
route.post("/verifylogin", FrontController.verifylogin);
route.get("/logout", FrontController.logout);

//course route
route.post("/courseInsert", checkAuth, CourseController.courseInsert);
route.get("/display", checkAuth, CourseController.courseDisplay);
route.get("/course/edit/:id", checkAuth, CourseController.Edit);
route.get("/course/view/:id", checkAuth, CourseController.courseView);
route.get("/course/deleteUser/:id", checkAuth, CourseController.courseDelete);
route.post("/courseUpdate/:id", checkAuth, CourseController.courseUpdate);

//admin
route.get("/admin/dashboard", checkAuth, AdminController.dashboard);
route.get("/admin/displayUser", checkAuth, AdminController.display);
route.get("/admin/addUser", checkAuth, AdminController.adduser);
route.get("/admin/viewUser/:id", checkAuth, AdminController.viewUser);
route.get("/admin/CourseView/:id", checkAuth, AdminController.CourseView);
route.get("/admin/editUser/:id", checkAuth, AdminController.editUser);
route.get("/admin/deleteUser/:id", checkAuth, AdminController.deleteUser);
route.get("/admin/courseDelete/:id", checkAuth, AdminController.courseDelete);
route.post("/admin/userInsert", checkAuth, AdminController.userInsert);
route.get("/admin/courseDisplay", checkAuth, AdminController.courseDisplay);
route.post("/admin/updateUser/:id", checkAuth, AdminController.updateUser);
route.post("/admin/statusUpdate/:id", checkAuth, AdminController.statusUpdate);

// Route to get the count of form submissions
route.get("/count-form-submissions", AdminController.countFormSubmissions);

//profile
route.get("/profile", checkAuth, FrontController.profile);
route.post("/updateProfile", checkAuth, FrontController.updateProfile);
route.post("/changePassword", checkAuth, FrontController.changePassword);

//forget password
route.post("/forgot_Password", FrontController.forgetPasswordVerify);
route.get("/reset-password", FrontController.reset_Password);
route.post("/reset_Password1", FrontController.reset_Password1);
route.get("/verify", FrontController.verifyMail);

module.exports = route;
