const express = require("express");
const router = express.Router();

const { readApartmentHome } = require("../controllers/home/readApartmentHome");

router.get("/home", readApartmentHome);

module.exports = router;
