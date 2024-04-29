const express = require("express");
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const config = require("./config/config");
const { connectDB } = require("./config/dbConfig");
const v1Routes = require("./routes/v1/index");
const chatData = require("./data/data");
const {
  errorHandler,
  notFound,
  badJSONHandler,
} = require("./middlewares/errorMiddlewares");
//Socket
const app = express();

app.use(compression());
//connect to mongodb server
connectDB();

app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(badJSONHandler);

//base url
app.get("/", (req, res) => {
  const statusCode = httpStatus.OK;
  return res.status(statusCode).json({
    success: true,
    code: statusCode,
    message: "",
  });
});

app.get("/api/chat", (req, res) => {
  res.json({ success: true, data: chatData });
});

//v1 api routes
app.use("/api/v1", v1Routes);

//404
app.use(notFound);
app.use(errorHandler);

//socket
const server = require('http').createServer(app);
server.listen(config.PORT, () => {
  console.log(`Listening on http://localhost:${config.PORT}`);
});