import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/express-mvc";

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    const email = "seeduser@example.com";
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(
        `User with email ${email} already exists. Skipping creation.`,
      );
      process.exit(0);
    }

    const user = await User.create({
      name: "Seed User",
      email,
      password: "Password123",
      role: "worker",
      avatar: "",
      coins: 10,
    });

    console.log("Seed user created:");
    console.log(`  email: ${user.email}`);
    console.log("  password: Password123");
    console.log("  role: worker");
    console.log("  coins: 10");

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seed();
