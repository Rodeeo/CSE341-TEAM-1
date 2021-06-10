const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timecardSchema = new Schema({
  /* userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }, */
  // TODO: again, change these to references, something like above
  userId: {
    type: Number,
    required: true,
  },
  organizationId: {
    type: Number,
    required: true,
  },
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
