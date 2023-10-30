const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/db/dbConnect");
const { userRegisterCtrl } = require("./controllers/users/usersCtrl");
dotenv.config();

const app = express();
//DB
dbConnect();
app.use(express.json());
app.post("/api/users/register",userRegisterCtrl)
app.listen(process.env.PORT, () => {
  console.log(`Server is running..`);
});
