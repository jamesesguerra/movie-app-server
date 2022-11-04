const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const List = require("../models/list");
const User = require("../models/user");


router.get("/", async(req, res, next) => {
  const lists = await List.find({});

  try {
    res.json(lists);
  } catch(err) {
    next(err);
  }
});


router.get("/:id", async(req, res, next) => {
  const list = await List.findById(req.params.id);

  try {
    if (list) res.json(list);
    else res.status(404).end();
  } catch(err) {
    next(err);
  }
});

const getTokenFrom = request => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

router.post("/", async(req, res, next) => {
  const body = req.body;
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const list = new List({
    name: body.name,
    description: body.description || "",
    user: user._id
  });

  try {
    const savedList = await list.save();
    user.lists = user.lists.concat(savedList._id);
    await user.save();
    res.status(201).json(savedList);
  } catch(err) {
    next(err);
  }
});


router.put("/:id", async(req, res, next) => {
  const body = req.body;

  const list = {
    name: body.name,
    description: body.description || "",
    movies: body.movies
  };

  try {
    const updatedList = await List.findByIdAndUpdate(req.params.id, list, { new: true });
    res.json(updatedList);
  } catch(err) {
    next(err);
  }
});


router.delete("/:id", async(req, res, next) => {
  try {
    await List.findByIdAndRemove(req.params.id);
    res.send(204).end();
  } catch(err) {
    next(err);
  }
});


module.exports = router;