const express = require("express");
const router = express.Router();

const List = require("../models/list");


router.get("/", async(req, res, next) => {
  const lists = await List.find({});
  res.json(lists);
});

router.get("/:id", async(req, res, next) => {
  const list = await List.findById(req.params.id);

  if (list) res.json(list);
  else res.status(404).end();
});

router.post("/", async(req, res, next) => {
  const body = req.body;

  const list = new List({
    name: body.name,
    description: body.description || "",
  });

  const savedList = await list.save();
  res.json(savedList);
});

router.put("/:id", async(req, res, next) => {
  const body = req.body;

  const list = {
    name: body.name,
    description: body.description || "",
    movies: body.movies
  };

  const updatedList = await List.findByIdAndUpdate(req.params.id, list, { new: true });
  res.json(updatedList);
});

router.delete("/:id", async(req, res, next) => {
  await List.findByIdAndRemove(req.params.id);
  res.send(204).end();
});


module.exports = router;