const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("../models/User");

const router = express.Router();

// Login Page
router.get("/login", (req, res) => res.render("login"));

// Register Page
router.get("/register", (req, res) => res.render("register"));

// Register Handle
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  // check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill all required fields" });
  }

  // check password match
  if (password2 !== password) {
    errors.push({ msg: "Passwords do not match" });
  }

  // check pass length
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters " });
  }

  if (!errors.length) {
    const user = await User.findOne({ email });
    if (user) {
      errors.push({ msg: "User is already exists" });
    } else {
      // Hash Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      req.flash("success_msg", "You are now registered and can log in");
      res.redirect("./login");
    }
  }
  if (errors.length) {
    res.render("register", { errors, name, email, password, password2 });
  }
});

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "./login",
    failureFlash: true,
  })(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res, next) => {
  req.logOut();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
