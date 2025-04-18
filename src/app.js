require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

require("./dbs/init.mongodb");
const { checkOverloading } = require("./helpers/check.connect");
const { configSwagger } = require("./swagger");
checkOverloading();

app.use(express.json());
// -------------Thêm Swagger vào ứng dụng dùng cho yaml-----------------
configSwagger(app)

app.use("/", require("./routes/index"));

app.use((req, res, next) => {
  const error = new Error("Not found");
  console.log("error này ở app.js nhé ", error);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {  // Add `next` here
  const statusCode = error.status || 500;
  console.log("statusCode ở app.js", statusCode);
  return res.status(statusCode).json({
    status: "Error",
    code: statusCode,

    // Log ra lỗi
    stack:error.stack,
    message: error.message || "Internal server error",
  });
});


module.exports = app;
