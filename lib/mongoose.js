const mongoose = require('mongoose');
const db = require('../models');
const MONGO_URI = process.env.MONGO_URI;
mongoose.Promise = global.Promise;
module.exports = async function () {
  mongoose.connection.on('connected', () => {
    console.log(`mongoose connection open to ${MONGO_URI}`);
  });

  // if the connection throws an error
  mongoose.connection.on('error', (err) => console.log(err));
  // when the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    console.log('mongoose disconnected');
  });

  // connect to mongodb
  await reconnect();
  global.mongoose = mongoose;
  return mongoose;
};

const MONGOOSE_RECONNECT_MS = 1000;
const reconnect = async() => {
  try {
    await mongoose.connect(MONGO_URI, {
    });
    global.db = db;
    Promise.resolve();
  } catch (err) {
    console.log(err);
    console.log(`attempting to reconnect in (${MONGOOSE_RECONNECT_MS}) ms`);
    setTimeout(() => {
      Promise.resolve(reconnect());
    }, MONGOOSE_RECONNECT_MS);
  }
};
