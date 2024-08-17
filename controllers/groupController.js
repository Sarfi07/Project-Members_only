const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Group = require("../models/group");
const Message = require("../models/message");
const User = require("../models/user");

const db = require("../db/queries");

exports.index = asyncHandler(async (req, res, next) => {
  // const groups = await Group.find({});
  const groups = await db.getAllGroups();

  res.render("allGroups", {
    title: "All Groups",
    groups: groups,
    currentUser: req.user,
  });
});

exports.userGroups_get = asyncHandler(async (req, res, next) => {
  // give all the groups of the user
  // const groups = await User.findById(req.user).populate("groups").exec();
  const groups = await db.getUserGroups(req.user.id);

  if (groups.length) {
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

    const group = {
      name: req.body.groupName,
      secretKey: req.body.secretKey,
      admin_id: req.user.id,
      // members: [req.user.id],
    };

    try {
      // await group.save();
      const group_id = await db.createGroup(group);
      await db.addMembership(group_id, req.user.id);
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }),
];

exports.verifySecretKey = asyncHandler(async (req, res, next) => {
  const group_id = req.params.groupId;
  const secretKey = req.body.secretKey;

  try {
    // const group = await Group.findById(groupId);
    const group = await db.getGroup(group_id);
    const groupMembers = await db.getAllGroupMembers(group_id);
    // const user = await User.findById(req.user.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.secret_key !== secretKey) {
      res.render("error", {
        title: "Error",
        message: "Invalid secret key",
        error: new Error("Invalid Secret key"),
      });
    } else {
      if (!groupMembers.includes(req.user.id)) {
        // group.members.push(req.user.id);
        // user.groups.push(group._id);
        // await group.save();
        // await user.save();
        await db.addMembership(group_id, req.user.id);
        res.redirect("/groups/" + group_id);
      } else {
        res
          .status(400)
          .json({ message: "User is already a member of the group" });
      }
    }
  } catch (error) {
    console.error("Error verifying secret key and adding user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

exports.groups_update_get = asyncHandler(async (req, res, next) => {
  // const group = await Group.findById(req.params.groupId);

  const group = await db.getGroup(req.params.groupId);
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

    // const oldInstance = await Group.findById(req.params.groupId);
    const oldInstance = await db.getGroup(req.params.groupId);

    const updated_group = {
      name: req.body.groupName,
      secret_key: req.body.secretKey,
    };

    try {
      // await Group.findByIdAndUpdate(req.params.groupId, group);
      await db.updateGroup(updated_group, req.params.groupId);
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }),
];

exports.group_get = asyncHandler(async (req, res, next) => {
  // get the default group and its message and based on it the user is present in the members list of the group then show them message details

  // const default_group = await Group.findById(req.params.groupId);
  // to create message with the correct group id
  const group = await db.getGroup(req.params.groupId);

  // const messages = await Message.find({ group: default_group._id })
  //   .populate("author")
  //   .exec();
  const messages = await db.getGroupsMessages(group.id);

  let added;

  try {
    // added = await Group.findOne({
    //   _id: default_group,
    //   members: req.user,
    // });
    added = await db.checkMembership(group.id, req.user.id);
  } catch (err) {
    return next(err);
  }

  // let admin = default_group.admin.includes(req.user.id) ? true : false;
  let admin = group.admin_id === req.user.id;

  res.render("group_page", {
    currentUser: req.user,
    messages: messages,
    group: group,
    added: added,
    admin: admin,
  });
});

exports.group_delete = asyncHandler(async (req, res) => {
  // double checking authorisation
  const group = await db.getGroup(req.params.groupId);

  if (group.admin_id === req.user.id) {
    await db.deleteGroup(req.params.groupId);
    res.redirect("/groups/userGroups");
  }
});
