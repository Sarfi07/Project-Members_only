// // first and last name, username, hashed password
// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const UserSchema = new Schema({
//   firstName: { type: String, required: true, minLength: 1 },
//   lastName: { type: String, required: true, minLength: 1 },
//   username: { type: String, required: true, minLength: 4, unique: true },
//   password: { type: String, required: true },
//   groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
// });

// module.exports = mongoose.model("User", UserSchema);
