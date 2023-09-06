const asyncHandler = require("express-async-handler");
var Datastore = require("nedb");

const db = new Datastore("./db/database.db");
db.loadDatabase();

const saveURL = asyncHandler(async (req, res) => {
  regex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  const url = req.body.url;

  if (!regex.test(url)) {
    res.json({ error: "invalid url" });
  }

  const countPromise = () => {
    return new Promise((resolve, reject) => {
      db.count({}, function (err, count) {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
    });
  };

  try {
    const count = await countPromise();
    const shortUrl = count + 1;

    var message = {
      original_url: url,
      short_url: shortUrl,
    };

    // Insert the message into the database.
    db.insert(message, function (err, newDoc) {
      if (err) {
        console.error(err);
      } else {
        res.json(message);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getShortURL = asyncHandler(async (req, res) => {
  const shortUrlID = req.params.id;

  db.findOne({ short_url: 1 }, function (err, doc) {
    if (err) {
      console.error(err);
      res.json({ error: err });
    } else {
      console.log("Redirecting To:", doc.original_url);
      res.redirect(doc.original_url);
    }
  });
});

module.exports = { saveURL, getShortURL };
