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

afterAll(() => {
  mongoose.connection.close();
});