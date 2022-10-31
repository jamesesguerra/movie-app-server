const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
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


beforeEach(async() => {
  await List.deleteMany({});
  let listObject = new List(initialLists[0]);
  await listObject.save();
  listObject = new List(initialLists[1]);
  await listObject.save();
});


test("lists are returned as json", async() => {
  await api
    .get("/lists")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});


test("all lists are returned", async() => {
  const response = await api.get("/lists");

  expect(response.body).toHaveLength(initialLists.length);
});


test("a specific list is returned within the returned lists", async() => {
  const response = await api.get("/lists");

  const contents = response.body.map(r => r.description);
  expect(contents).toContain("a new description");
});


test("a valid list can be added", async() => {
  const newList = {
    name: "Test List",
    description: "a test description"
  };

  await api
    .post("/lists")
    .send(newList)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/lists");
  const contents = response.body.map(r => r.description);

  expect(response.body).toHaveLength(initialLists.length + 1);
  expect(contents).toContain("a test description");
});


test("a list with no name is not added", async() => {
  const newList = {
    description: "a list with no name"
  };

  await api
    .post("/lists")
    .send(newList)
    .expect(400)

  const response = await api.get("/lists");

  expect(response.body).toHaveLength(initialNotes.length);
});


afterAll(() => {
  mongoose.connection.close();
});