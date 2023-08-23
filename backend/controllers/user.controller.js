const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });

    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user)
        return res.status(401).json({
          message: "Auth failed",
        });

      bcrypt.compare(req.body.password, user.password).then((result) => {
        if (!result)
          return res.status(401).json({
            message: "Auth failed",
          });

        const token = jwt.sign(
          { email: user.email, userId: user._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          token: token,
        });
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Auth failed",
      });
    });
};
