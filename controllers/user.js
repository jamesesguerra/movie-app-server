const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");


router.get("/", async(req, res) => {
  const users = await User
    .find({}).populate("lists");
  res.json(users);
});

router.post("/", async(req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      error: "This email is already associated with an account."
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email,
    passwordHash
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

module.exports = router;