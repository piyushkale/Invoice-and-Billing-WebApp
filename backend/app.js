const express = require("express");
const connectDB = require("./utils/db-connection");
const indexRoute = require("./routes/index");

const path = require("path");
require("dotenv").config();
const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api", indexRoute);

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Server is running on PORT ${PORT}`);
});
