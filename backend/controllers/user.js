const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { secretToken } = require("../config"); //  import from config

console.table(jwt);

exports.register = (req, res, next) => {
  //const username = req.body.name;
  const { name: username, email, pwd, role } = req.body;

  if (!username || !email || !pwd) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required." });
  }
  bcrypt
    .hash(pwd, 10)
    .then((hash) => {
      const userClient = new User({
        name: username,
        email: email,
        pwd: hash,
        role: role,
      });

      userClient
        .save()
        .then(() => {
          console.log(JSON.stringify(userClient));
          res
            .status(200)
            .json({ message: `${userClient.role} created:`, userClient });
        })
        .catch((err) => {
          // Duplicate key error
          if (err.code === 11000) {
            const duplicatedField = Object.keys(err.keyValue)[0];
            return res.status(400).json({
              error: `${duplicatedField} already exists.`,
            });
          }

          // Mongoose validation errors (regex, required, etc.)
          if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
          }

          // Unexpected server errors
          console.error(err);
          res.status(500).json({ error: "Server error" });
        });
    })
    .catch((err) => res.status(500).json({ err }));
};

exports.signin = (req, res, next) => {
  const pwd = req.body.pwd;
  const userName = req.body.name;
  console.log(userName, pwd, req.body);

  User.findOne({ name: userName })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "incorrect email/password " });
      }
      bcrypt
        .compare(pwd, user.pwd)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "incorrect email/password " });
          }
          res.status(200).json({
            userId: user._id,
            userName: user.name,
            role: user.role,
            token: jwt.sign(
              { userId: user._id, userName: user.name, role: user.role }, //add user.role to the token
              secretToken,
              {
                expiresIn: "1h",
              }
            ),
          });
        })
        .catch((err) => res.status(500).json({ err }));
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};
