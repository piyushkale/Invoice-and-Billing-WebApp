const express = require("express");
const connectDB = require("./utils/db-connection");
require("dotenv").config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>This is homepage</h1>");
});

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Server is running on PORT ${PORT}`);
});
