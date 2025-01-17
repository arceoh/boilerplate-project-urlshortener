const mongoose = require("mongoose");

const urlSchema = mongoose.Schema({
  original_url: String,
  short_url: Number,
});

const URL = mongoose.model("URL", urlSchema);

module.exports = { URL };
