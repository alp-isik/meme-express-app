const express = require("express");
const router = express.Router();
const axios = require("axios");

const config = require("../data/config.json");

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
}

let memesCache = null;

// memes table
router.get("/memes", async (req, res) => {
  try {
    if (!memesCache) {
      const response = await axios.get(config.MEMES_API_URL);
      memesCache = response.data.memes;
    }

    const search = (req.query.search || "").trim().toLowerCase();

    let memesToShow = memesCache;

    if (search) {
      memesToShow = memesCache.filter((m) =>
        (m.name || "").toLowerCase().includes(search),
      );
    }

    res.render("memes", {
      memes: memesToShow,
      user: req.user,
      viewedMemes: req.session.viewedMemes || [],
      search,
    });
  } catch (err) {
    console.error("Memes API failed:", err.message);

    res.status(502).render("memes", {
      memes: [],
      user: req.user,
      viewedMemes: req.session.viewedMemes || [],
      search: (req.query.search || "").trim(),
      apiError: "Could not load memes. Please try again later.",
    });
  }
});

// details button (JS -> POST)
router.post("/meme", ensureLoggedIn, (req, res) => {
  const selectedMemeId = parseInt(req.body.id);

  if (!Number.isInteger(selectedMemeId)) {
    return res.status(400).send("Invalid meme id");
  }

  req.session.selectedMemeId = selectedMemeId;
  res.redirect("/meme");
});

// single meme
router.get("/meme", ensureLoggedIn, async (req, res) => {
  const selectedMemeId = req.session.selectedMemeId;

  if (!selectedMemeId) {
    return res.redirect("/memes");
  }

  // if someone hits /meme before /memes ever loaded cache
  if (!memesCache) {
    try {
      const response = await axios.get(config.MEMES_API_URL);
      memesCache = response.data.memes;
    } catch (err) {
      console.error("Memes API failed:", err.message);
      return res.status(502).send("Could not load memes");
    }
  }

  const meme = memesCache.find((m) => m.id === selectedMemeId);

  if (!meme) {
    return res.status(404).send("Meme not found");
  }

  if (!req.session.viewedMemes) req.session.viewedMemes = [];
  if (!req.session.viewedMemes.includes(selectedMemeId)) {
    req.session.viewedMemes.push(selectedMemeId);
  }

  res.render("meme", { meme });
});

module.exports = router;
