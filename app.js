const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");

const passport = require("passport");
const session = require("express-session");
const JsonStore = require("express-session-json")(session);

const indexRouter = require("./routes/index");
const memesRouter = require("./routes/memes");
const authRouter = require("./routes/auth");

const app = express();

// Views (EJS)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Request parsing + logging
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files (public + npm libraries, no CDN)
app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.static(path.join(__dirname, "node_modules", "bootstrap", "dist")),
);
app.use(
  express.static(path.join(__dirname, "node_modules", "bootstrap-icons")),
);
app.use(express.static(path.join(__dirname, "node_modules", "jquery", "dist"))); // required by brief

// Sessions + Passport session auth
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new JsonStore(),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Make user available in every EJS file as "user"
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Reset selected meme + viewed rows when the server restarts
const SERVER_BOOT_ID = Date.now();

app.use((req, res, next) => {
  if (req.session.bootId !== SERVER_BOOT_ID) {
    req.session.bootId = SERVER_BOOT_ID;
    req.session.viewedMemes = [];
    req.session.selectedMemeId = null;
  }
  next();
});

// Routes
app.use("/", indexRouter);
app.use("/", memesRouter);
app.use("/", authRouter);

// 404 + error handler
app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
