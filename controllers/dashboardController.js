const asyncHandler = require("express-async-handler");
const Groups = require("../models/group");
const User = require("../models/user");
const Message = require("../models/message");
const group = require("../models/group");

exports.index = asyncHandler(async (req, res, next) => {
  // get the default group and its message and based on it the user is present in the members list of the group then show them message details

  const default_group = await Groups.findOne();
  // to create message with the correct group id

  const messages = await Message.find({ group: default_group._id })
    .populate("author")
    .exec();

  let added;

  try {
    added = await Groups.findOne({
      _id: default_group,
      members: req.user,
    });
  } catch (err) {
    return next(err);
  }

  let admin = default_group.admin.includes(req.user.id) ? true : false;

  res.render("dashboard", {
    currentUser: req.user,
    groupName: default_group.name,
    messages: messages,
    group: default_group,
    added: added ? true : false,
    admin: admin,
  });
});
