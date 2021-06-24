const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  organizationName: {
    type: String,
    required: true,
  },
  organizationContact: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Organization", organizationSchema);
