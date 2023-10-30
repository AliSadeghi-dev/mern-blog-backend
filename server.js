const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./routes/users/usersRoute");
const errorHandler = require("./middlewares/error/errorHandler");

dotenv.config();

const app = express();
//DB
dbConnect();
app.use(express.json());

//routes
app.use("/api/users", userRoutes);

//error Handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running..`);
});
