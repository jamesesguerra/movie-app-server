const config = require("./utils/config");
const express = require("express");
const cors = require("cors");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");


const app = express();

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("error connecting to MongoDB:", err.message);
  });

app.use(express.json());
app.use(cors());

app.use(express.static("build"));
app.use("/lists", require("./controllers/list"));
app.use("/users", require("./controllers/user"));
app.use("/login", require("./controllers/login"));
app.use("/email", require("./controllers/email"));

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);


module.exports = app;
