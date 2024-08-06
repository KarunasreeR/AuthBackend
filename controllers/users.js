const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticationMiddleware = require("../middlewares/authentication");
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
exports.createUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    res.json({ status: 0, data: "user already exists" });
  } else if (!passwordPattern.test(req.body.password)) {
    return res.json({
      status: 0,
      data: "Password must have at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 6 characters long.",
    });
  } else {
    let encryptedPassword;
    try {
      let salt = bcrypt.genSaltSync(10);
      encryptedPassword = bcrypt.hashSync(req.body.password, salt);
      console.log(encryptedPassword);
    } catch (err) {
      console.log("in catch");
      res.json(err);
    }
    const userOb = new User({
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob,
      password: encryptedPassword,
    });
    userOb.save((err) => {
      if (err) {
        res.json(err);
      } else {
        res.json({ status: 1, data: "user created successfully" });
      }
    });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const date = new Date(user.dob);
    const formattedDate = date.toISOString().slice(0, 10);

    if (req.body.dob === formattedDate) {
      const payload = {
        user: {
          email: req.body.email,
        },
      };
      jwt.sign(payload, "secretString", { expiresIn: 1200 }, (err, token) => {
        if (err) {
          res.json(err);
        } else {
          res.json({ status: 1, token: token });
        }
      });
    } else {
      res.json({ status: 0, data: "invalid details" });
    }
  } catch (e) {
    res.json({ status: 0, error: e });
  }
};
exports.getUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      res.json(err);
    } else {
      res.json(users);
    }
  });
};
exports.getUser = [
  authenticationMiddleware,
  async (req, res) => {
    console.log(req.headers);
    const userOb = await User.findOne({ email: req.params.email });
    res.json({ status: 1, data: userOb });
  },
];
exports.loginUser = async (req, res) => {
  const userOb = await User.findOne({ email: req.body.email });
  if (!userOb) {
    res.json({ status: 0, data: "user not found" });
  } else {
    const passCorrect = bcrypt.compareSync(req.body.password, userOb.password);
    if (!passCorrect) {
      res.json({ status: 0, data: "user credentials wrong" });
    }
    const payload = {
      user: {
        email: req.body.email,
      },
    };
    jwt.sign(payload, "secretString", { expiresIn: 1200 }, (err, token) => {
      if (err) {
        res.json(err);
      } else {
        res.json({ status: 1, token: token });
      }
    });
  }
};
exports.listUsers = [
  authenticationMiddleware,
  (req, res) => {
    User.find((err, users) => {
      if (err) {
        res.json(err);
      } else {
        res.json(users);
      }
    });
  },
];
exports.editUser = [
  authenticationMiddleware,
  async (req, res) => {
    try {
      // Validate the password
      if (!passwordPattern.test(req.body.password)) {
        return res.json({
          status: 0,
          data: "Password must have at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 6 characters long.",
        });
      }

      // Encrypt the new password
      const salt = bcrypt.genSaltSync(10);
      const encryptedPassword = bcrypt.hashSync(req.body.password, salt);

      // Update the user details
      const updatedData = {
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        password: encryptedPassword,
      };

      const result = await User.updateOne(
        { email: req.params.email },
        updatedData
      );

      // Check if the update was successful
      if (result.modifiedCount > 0) {
        res.json({ status: 1, data: "User details modified successfully" });
      } else {
        res.json({ status: 0, data: "No changes made to the user" });
      }
    } catch (err) {
      res.json({ status: 0, data: err.message });
    }
  },
];
