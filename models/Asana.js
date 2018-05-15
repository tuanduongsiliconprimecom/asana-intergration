/**
 * User model
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    externalId: { //from slack
      type: String,
      required: true,
      unique: true
    },
    uid: { // from asana
      type: String,
      required: true,
      unique: true
    },
    accessToken: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  {
    collection: 'asanas',
    timestamps: {},
    strict: true
  }
);

module.exports = mongoose.model('Asana', schema);
