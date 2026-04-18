
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require('../models/User'); 


const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const name = "Admin";
    const email = "admin@example.com";
    const password = "admin123"; 
    const role = "admin";

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create admin
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();