var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const usersRouter = require("./routes/users");
const leadsRouter = require("./routes/leads");

var app = express();

// Import the database configurations
const { mongoConfig } = require("./connect");

// Construct the MongoDB connection string using the configuration
let mongoConnUrl = `mongodb+srv://${mongoConfig.username}:${encodeURIComponent(
  mongoConfig.password
)}@${mongoConfig.clusterUrl}/${
  mongoConfig.dbName
}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoConnUrl, { useNewUrlParser: true });
let db = mongoose.connection;

db.on("error", function (error) {
  console.log("unable to connect to the mongodb");
  console.log(error);
});

db.on("open", function () {
  console.log("we are connected to the mongodb server via mongoose ");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "session_secret_key",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  })
);

app.use("/users", usersRouter);
app.use("/leads", leadsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
