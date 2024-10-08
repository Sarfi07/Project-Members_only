const asyncHandler = require("express-async-handler");
const Groups = require("../models/group");
const User = require("../models/user");
const Message = require("../models/message");
const group = require("../models/group");

const db = require("../db/queries");

exports.index = asyncHandler(async (req, res, next) => {
  // get the default group and its message and based on it the user is present in the members list of the group then show them message details

  // const default_group = await Groups.findOne();
  const default_group = await db.getGroup(1);
  // to create message with the correct group id

  // const messages = await Message.find({ group: default_group._id })
  //   .populate("author")
  //   .exec();

  const messages = await db.getGroupsMessages(default_group.id);

  let added;

  try {
    // added = await Groups.findOne({
    //   _id: default_group,
    //   members: req.user,
    // });

    added = await db.checkMembership(default_group.id, req.user.id);
  } catch (err) {
    return next(err);
  }

  let admin = default_group.admin_id === req.user.id;
  res.render("dashboard", {
    currentUser: req.user,
    messages: messages,
    group: default_group,
    added: added,
    admin: admin,
  });
});
