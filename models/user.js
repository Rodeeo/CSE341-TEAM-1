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
  userFirstname: {
    type: String,
    required: true,
  },
  userLastname: {
    type: String,
    required: true,
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Organization",
  },
  // TODO: make sure the above works; below is a failsafe
  /* organizationId: {
    type: Number,
    required: true,
  }, */
  // TODO: determine role names/hierarchy
  organizationRole: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

module.exports = mongoose.model("User", userSchema);
