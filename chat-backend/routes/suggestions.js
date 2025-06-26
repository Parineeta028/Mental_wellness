const express = require("express");
const router = express.Router();
const { getSuggestions } = require("../controllers/suggestionController");

router.post("/suggestions", getSuggestions);

module.exports = router;
