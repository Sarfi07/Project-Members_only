const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const Group = require("../models/group");
const db = require("../db/queries");

exports.message_delete = asyncHandler(async (req, res, next) => {
  try {
    // const message = await Message.findByIdAndDelete(req.params.id);
    const group_id = await db.deleteMessage(req.params.id);
    res.redirect(`/groups/${group_id}`);
  } catch (err) {
    return next(err);
  }
});

exports.sendMessage = asyncHandler(async (req, res, next) => {
  // create a message object and tie it to the group
  const messageObj = {
    message: req.body.message,
    author_id: req.user.id,
    group_id: req.params.groupId,
  };

  try {
    await db.createMessage(messageObj);
  } catch (err) {
    return next(err);
  }
  res.redirect(`/groups/${req.params.groupId}`);
});
