const mongoose = require("mongoose");

const validateMongoDbId = (id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) throw new Error("User id is not valid.");
};

module.exports = validateMongoDbId;
