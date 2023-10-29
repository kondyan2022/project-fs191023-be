const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const swaggerUI = require("swagger-ui-express");
const swaggerJSON = require("./swagger");
const usersRouter = require("./routes/users");
const trainingsRouter = require("./routes/exercises");
const productRouter = require("./routes/product");
const diaryRouter = require("./routes/diary");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
// app.use(express.static("public"));

app.use("/users", usersRouter);
app.use("/products", productRouter);
app.use("/exercises", trainingsRouter);

app.use("/diary", diaryRouter);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSON));
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
