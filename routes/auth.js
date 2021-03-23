const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireLogin = require("../midddleware/requireLogin");
const { url } = require("inspector");
// const nodemailer = require("nodemailer");
// const sendgridTransport = require("nodemailer-sendgrid-transport");

router.get("/protected", requireLogin, (req, res) => {
  res.send("Hello user");
});

// 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

// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key:
//         " 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",
//     },
//   })
// );

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exsists with the same email" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          pic,
        });

        user
          .save()
          .then((user) => {
            // transporter.sendMail({
            //   to: user.email,
            //   from: "no-reply@insta.com",
            //   subject: "sign-up succesfull...!",
            //   html: "<h1>Welcome to Instagram clone by Sai</h1>",
            // });
            res.json({ message: "saved Succesfully" });
          })

          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({ message: "successfully signed in" });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, following, followers, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, email, following, followers, pic },
          });
        } else {
          return res.status(422).json({ error: "Invalid Email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
