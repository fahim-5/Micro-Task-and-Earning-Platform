import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/appError.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = "worker", avatar } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists with this email", 400));
    }

    // Determine starting coins by role
    let startingCoins = 0;
    if (role === "worker") startingCoins = 10;
    if (role === "buyer") startingCoins = 50;

    // Create user with role/avatar/coins
    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar,
      coins: startingCoins,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid email or password", 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth sign-in (create or login)
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
  try {
    const { name, email, avatar, role = "worker" } = req.body;
    if (!email) return next(new AppError("Email is required", 400));

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return sendTokenResponse(user, 200, res);
    }

    // Create a random password for account created via Google
    const randomPassword = Math.random().toString(36).slice(-12);

    let startingCoins = 0;
    if (role === "worker") startingCoins = 10;
    if (role === "buyer") startingCoins = 50;

    user = await User.create({
      name: name || "Google User",
      email,
      password: randomPassword,
      role,
      avatar,
      coins: startingCoins,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};
