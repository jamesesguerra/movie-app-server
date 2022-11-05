const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");


router.get("/", async(req, res, next) => {
  try {
    const users = await User
      .find({}).populate("lists");
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async(req, res, next) => {
  const user = await User
    .findById(req.params.id).populate("lists");

  try {
    if (user) res.json(user);
    else res.status(404).end();
  } catch (err) {
    next(err);
  }
});

router.post("/", async(req, res, next) => {
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

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;