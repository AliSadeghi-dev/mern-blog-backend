const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`, {
      useNewUrlParser: true,
    });
    console.log("Connected to Database");
  } catch (error) {
    console.log(`Error ${error} `);
  }
};

module.exports = dbConnect;
