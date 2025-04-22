const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorizeRole = require("../middleware/authorizeRole");
const userCtrl = require("../controllers/user");
const { userLike } = require("../controllers/userLike");
const { userReadOneApt } = require("../controllers/userReadOneApt");

router.post("/register", userCtrl.register);
router.post("/signin", userCtrl.signin);

router.post("/:id/like", /*authenticate,*/ userLike);

// Route accessible only to 'user' role
router.get(
  "/:id",

  userReadOneApt
);

module.exports = router;
