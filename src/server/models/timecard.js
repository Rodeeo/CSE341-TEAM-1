const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timecardSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // TODO: make sure the above works; below is a failsafe
  /* userId: {
    type: Number,
    required: true,
  }, */
  // TODO: add organization id for people to belong to multiple organizations
  timecardDate: {
    type: Date,
    required: true,
  },
  timecardValue: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Timecard", timecardSchema);
