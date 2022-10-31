const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);


test("lists are returned as json", async() => {
  await api
    .get("/lists")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two lists", async() => {
    const response = await api.get("/lists");

    expect(response.body).toHaveLength(2);
})

test("the first list's description is a test description", async() => {
    const response = await api.get("/lists");

    expect(response.body[0].description).toBe("Test description");
})

afterAll(() => {
    mongoose.connection.close();
});