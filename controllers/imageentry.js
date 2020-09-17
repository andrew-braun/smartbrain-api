const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "57c008f0aadb46e4a75b6ae94fe85334",
});

const handleApiCall = (req, res) => {
  app.models
  .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json("Unable to connect with API"))
}

const handleImageEntry = (req, res, db) => {
  const { id } = req.body;
  /* Tap into clarifai face recognition API */

  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("Unable to get count"));
};

module.exports = {
  handleImageEntry,
  handleApiCall
};
