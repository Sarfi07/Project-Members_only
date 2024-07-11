// group name, group admin, group members

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    admin: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    secretKey: { type: String, required: true },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true,
  }
);

GroupSchema.virtual("url").get(function () {
  return `/groups/${this._id}`;
});

module.exports = mongoose.model("Group", GroupSchema);
