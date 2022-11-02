const express = require("express");
const router = express.Router();

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


router.post("/", async(req, res, next) => {
  const body = req.body;

  const user = await User.findById(body.userId);

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