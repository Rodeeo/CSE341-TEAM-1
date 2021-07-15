const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userEmail: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  userFirstName: {
    type: String,
    required: true,
  },
  userLastName: {
    type: String,
    required: true,
  },
  // organizationId: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  //   ref: "Organization",
  // },
  // TODO: make sure the above works; below is a failsafe
  organizationId: {
    type: Number,
    required: true,
  },
  // TODO: determine role names/hierarchy
  organizationRole: {
    type: String,
    required: true,
  },
  timecards: {
    type: Schema.Types.ObjectId,
    ref: "Timecard"
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

module.exports = mongoose.model("User", userSchema);
