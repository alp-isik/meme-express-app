const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// store minimal user info in session
passport.serializeUser((user, cb) => {
  cb(null, { username: user.username });
});

// restore user from session
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// local username/password strategy
passport.use(
  new LocalStrategy((username, password, cb) => {
    const users = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../data/users.json")),
    );

    const user = users.find((u) => u.username === username);
    if (!user) return cb(null, false);
    if (user.password !== password) return cb(null, false);

    return cb(null, user);
  }),
);

// login
router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/memes",
    failureRedirect: "/login",
  }),
);

// logout (full session wipe)
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => res.redirect("/login"));
  });
});

// login page
router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
