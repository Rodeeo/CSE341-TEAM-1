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
  // TODO: change this to not require hard-coding organization id
  organizationId: {
    type: Number,
    required: true,
  },
  // TODO: determine role names/hierarchy
  organizationRole: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

module.exports = mongoose.model("User", userSchema);
