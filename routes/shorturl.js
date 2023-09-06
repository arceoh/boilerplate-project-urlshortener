const express = require("express");
const router = express.Router();

const { saveURL, getShortURL } = require("../controllers/shorturl.js");

router.post("/", saveURL);
router.get("/:id", getShortURL);

module.exports = router;
