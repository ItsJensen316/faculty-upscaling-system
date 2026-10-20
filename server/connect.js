const mongoose = require("mongoose");

async function connectToMongoDB(url) {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch(() => {
      console.log("Database cannot be Connected");
    });
}

module.exports = {
  connectToMongoDB,
};
