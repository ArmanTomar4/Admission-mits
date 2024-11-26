const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const checkAuth = async (req, res, next) => {
  // console.log("hello authentication")
  const { token } = req.cookies;
  //console.log(token);
  if (!token) {
    req.flash("error", "Please login first");
    res.redirect("/");
  } else {
    const verifyToken = jwt.verify(token, "huhihvfiheiheriheriber");
    //console.log(verifyToken)
    const data = await UserModel.findOne({ _id: verifyToken.ID });
    //console.log(data)
    req.userData = data;
    next();
  }
};

module.exports = checkAuth;
