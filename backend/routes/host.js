const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorizeRole = require("../middleware/authorizeRole");
const multer = require("../middleware/multer-config");

const { createApartment } = require("../controllers/host/createApartment");
const { modifyApartment } = require("../controllers/host/modifyApartment");
const { readOneApartment } = require("../controllers/host/readOneApartment");
const { readAllApartment } = require("../controllers/host/readAllApartment");
const { deleteApartment } = require("../controllers/host/deleteApartment");

// Route accessible only to 'host' role
router.post(
  "/host-only",
  authenticate,
  authorizeRole(["host"]),
  multer,
  createApartment
);
router.get(
  "/host-only/read",
  authenticate,
  authorizeRole(["host"]),
  readAllApartment
);
router.put(
  "/host-only/:id",
  authenticate,
  authorizeRole(["host"]),
  modifyApartment
);
router.get(
  "/host-only/:id",
  authenticate,
  authorizeRole(["host"]),
  readOneApartment
);
router.delete(
  "/host-only/:id",
  authenticate,
  authorizeRole(["host"]),
  deleteApartment
);
module.exports = router;
