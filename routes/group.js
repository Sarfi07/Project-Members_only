const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const isAuthenticated = require("../utils/checkAuthentication");

router.get("/", groupController.index);

router.get("/create", groupController.groups_create_get);

router.post("/create", groupController.groups_create_post);

router.post("/:groupId/verifySecretKey", groupController.verifySecretKey);

router.get("/:groupId/update", groupController.groups_update_get);
router.post("/:groupId/update", groupController.groups_update_post);

module.exports = router;
