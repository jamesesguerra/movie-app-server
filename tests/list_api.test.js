const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const List = require("../models/list");


beforeEach(async() => {
  await List.deleteMany({});

  let listObject = new List(helper.initialLists[0]);
  await listObject.save();

  listObject = new List(helper.initialLists[1]);
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

  expect(response.body).toHaveLength(helper.initialLists.length);
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

  const listsAtEnd = await helper.listsInDb();
  expect(listsAtEnd).toHaveLength(helper.initialLists.length + 1);

  const contents = listsAtEnd.map(l => l.description);
  expect(contents).toContain("a test description");
});


test("a list with no name is not added", async() => {
  const newList = {
    description: "a list with no name"
  };

  await api
    .post("/lists")
    .send(newList)
    .expect(400);

  const listsAtEnd = await helper.listsInDb();

  expect(listsAtEnd).toHaveLength(helper.initialLists.length);
});


test("a specific list can be viewed", async() => {
  const listsAtStart = await helper.listsInDb();

  const listToView = listsAtStart[0];

  const resultList = await api
    .get(`/lists/${listToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const processedListToView = JSON.parse(JSON.stringify(listToView));

  expect(resultList.body).toEqual(processedListToView);
});


test("a list can be deleted", async() => {
  const listsAtStart = await helper.listsInDb();
  const listToDelete = listsAtStart[0];

  await api
    .delete(`/lists/${listToDelete.id}`)
    .expect(204);

  const listsAtEnd = await helper.listsInDb();

  expect(listsAtEnd).toHaveLength(helper.initialLists.length - 1);

  const contents = listsAtEnd.map(l => l.description);

  expect(contents).not.toContain(listToDelete.description);
});


afterAll(() => {
  mongoose.connection.close();
});