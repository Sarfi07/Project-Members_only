const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Group = require("../models/group");
const Message = require("../models/message");
const User = require("../models/user");

exports.index = asyncHandler(async (req, res, next) => {
  // give all the groups of the user
  const groups = await User.findById(req.user).populate("groups").exec();

  if (groups) {
    res.render("groupList", {
      title: "Your Groups",
      groups: groups,
    });
  } else {
    res.render("groupList", {
      title: "You have no groups. Create or Join One.",
    });
  }
});
exports.groups_create_get = asyncHandler(async (req, res, next) => {
  res.render("group_form", {
    title: "Create a Group",
  });
});

exports.groups_create_post = [
  body("groupName", "Group name should not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("group_form", {
        title: "Error while creating the group",
      });
    }

    const group = new Group({
      name: req.body.groupName,
      secretKey: req.body.secretKey,
      admin: req.user.id,
      members: [req.user.id],
    });

    try {
      await group.save();
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }),
];

exports.verifySecretKey = asyncHandler(async (req, res, next) => {
  const groupId = req.params.groupId;
  const secretKey = req.body.secretKey;

  console.log(secretKey);

  try {
    const group = await Group.findById(groupId);
    const user = await User.findById(req.user.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.secretKey !== secretKey) {
      return res.status(401).json({ message: "Invalid secret key" });
    }

    if (!group.members.includes(req.user.id)) {
      group.members.push(req.user.id);
      user.groups.push(group._id);
      await group.save();
      await user.save();
      console.log("reached");
      res.redirect("/dashboard");
    } else {
      res
        .status(400)
        .json({ message: "User is already a member of the group" });
    }
  } catch (error) {
    console.error("Error verifying secret key and adding user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

exports.groups_update_get = asyncHandler(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);
  res.render("group_form", {
    group: group,
    title: "Update Group",
  });
});

exports.groups_update_post = [
  body("groupName", "Group name should not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("group_form", {
        title: "Error while creating the group",
      });
    }

    const oldInstance = await Group.findById(req.params.groupId);

    const group = new Group({
      name: req.body.groupName,
      secretKey: req.body.secretKey,
      admin: oldInstance.admin,
      members: oldInstance.members,
      _id: req.params.groupId,
    });

    try {
      await Group.findByIdAndUpdate(req.params.groupId, group);
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }),
];

exports.group_get = asyncHandler(async (req, res, next) => {
  // get the default group and its message and based on it the user is present in the members list of the group then show them message details

  const default_group = await Group.findById(req.params.groupId);
  // to create message with the correct group id

  const messages = await Message.find({ group: default_group._id })
    .populate("author")
    .exec();

  let added;

  try {
    added = await Group.findOne({
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
