const asyncHandler = require("express-async-handler");

const { URL } = require("../models/urlModel");

const saveURL = asyncHandler(async (req, res) => {
  regex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  const { url } = req.body;

  if (!url) {
    res.json({ error: "invalid url" });
  }

  if (!regex.test(url)) {
    res.json({ error: "invalid url" });
  }

  let countQuery = await URL.countDocuments({});

  if (!countQuery || countQuery === 0) {
    countQuery = 1;
  }

  const redirect = await URL.create({
    original_url: url,
    short_url: parseInt(countQuery + 1),
  });

  const message = {
    original_url: redirect.original_url,
    short_url: redirect.short_url,
  };

  res.json(message);
});

const getShortURL = asyncHandler(async (req, res) => {
  const shortUrlID = req.params.id;
  console.log(shortUrlID);
  console.log("TYPE", typeof shortUrlID);

  if (!shortUrlID || parseInt(shortUrlID) === NaN) {
    res.json({ error: "invalid url" });
  }

  const redirect = await URL.findOne({ short_url: shortUrlID });

  if (!redirect) {
    res.json({ error: "invalid url" });
  }

  res.redirect(redirect.original_url);
});

module.exports = { saveURL, getShortURL };
