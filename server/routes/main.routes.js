const express = require("express");
const router = express.Router();
const createConnection = require("../controllers/createConnection");

router.get("/", createConnection);

module.exports = router;
