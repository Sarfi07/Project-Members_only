var express = require("express");
var router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/sendMessage/:groupId", messageController.sendMessage);

router.post("/:id/delete", messageController.message_delete);

module.exports = router;
