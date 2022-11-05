const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const User = require("../models/user");


router.post("/", async(req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid email or password"
    });
  }

  const userForToken = {
    email: user.email,
    id: user._id
  };

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  );

  res
    .status(200)
    .send({ token, email: user.email, id: user._id });
});

module.exports = router;