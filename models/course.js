const mongoose = require("mongoose");
const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    dob: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      require: true,
    },
    education: {
      type: String,
      require: true,
    },
    course: {
      type: String,
      require: true,
    },
    user_id: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    comment: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("Course", courseSchema);

module.exports = CourseModel;
