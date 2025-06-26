
const express = require("express");
const router = express.Router();
const { askAI } = require("../controllers/chatController");

router.post("/ask", askAI);

module.exports = router;
