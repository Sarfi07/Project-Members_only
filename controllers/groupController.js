const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Group = require("../models/group");
const Message = require("../models/message");
const User = require("../models/user");

exports.index = asyncHandler(async (req, res, next) => {
  const groups = await Group.find({ members });
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

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.secretKey !== secretKey) {
      return res.status(401).json({ message: "Invalid secret key" });
    }

    if (!group.members.includes(req.user.id)) {
      group.members.push(req.user.id);
      await group.save();
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
