const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const Group = require("../models/group");

exports.message_delete = asyncHandler(async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    res.redirect(`/groups/${message.group}`);
  } catch (err) {
    return next(err);
  }
});

exports.sendMessage = asyncHandler(async (req, res, next) => {
  // create a message object and tie it to the group

  const group = await Group.findById(req.params.groupId);
  const message = new Message({
    message: req.body.message,
    author: req.user,
    group: group,
  });
  try {
    await message.save();
    group.messages.push(message._id);
    await group.save();
  } catch (err) {
    return next(err);
  }
  res.redirect(`/groups/${group._id}`);
});
