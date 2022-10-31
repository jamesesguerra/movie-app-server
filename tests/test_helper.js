const List = require("../models/list");


const initialLists = [
  {
    name: "New List",
    description: "a new description"
  },
  {
    name: "Another New List",
    description: "another new description"
  }
];

const nonExistingId = async() => {
  const list = new List({ description: "will remove this soon" });
  await list.save();
  await list.remove();

  return list._id.toString();
};

const listsInDb = async() => {
  const lists = await List.find({});
  return lists.map(list => list.toJSON());
};

module.exports = {
  initialLists, nonExistingId, listsInDb
};



