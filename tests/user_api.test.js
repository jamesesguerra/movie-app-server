const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");


describe("when there is initially one user in the db", () => {
  beforeEach(async() => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({ email: "root@gmail.com", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh email", async() => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      email: "kofinat@gmail.com",
      password: "coffeenut"
    };

    await api
      .post("/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const emails = usersAtEnd.map(e => e.email);
    expect(emails).toContain(newUser.email);
  });

  test("creation fails with 400 if email is already taken", async() => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      email: "root@gmail.com",
      password: "password123"
    };

    const result = await api
      .post("/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    
    expect(result.body.error).toContain("This email is already associated with an account.");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(() => {
  mongoose.connection.close();
});