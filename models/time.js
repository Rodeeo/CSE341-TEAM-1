const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const timeSchema = new Schema({
  activity: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

module.exports = mongoose.model('Time', timeSchema);