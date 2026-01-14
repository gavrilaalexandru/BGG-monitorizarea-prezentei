const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validateUser } = require("../middleware/validateRequest");
// configurarea rutelor pentru modulul express legat de utilizator
router.post("/", validateUser, userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

module.exports = router;
