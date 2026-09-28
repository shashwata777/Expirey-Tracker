import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendWelcomeEmail } from '../services/notificationService.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email address already exists');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  if (user) {
    // Send welcome email notification asynchronously
    sendWelcomeEmail(user).catch((err) =>
      console.warn('[Auth] Async welcome email error on register:', err.message)
    );

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        preferences: user.notificationPreferences,
        createdAt: user.createdAt,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user registration parameters');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (user && (await user.matchPassword(password))) {
    // Send login / welcome confirmation email notification asynchronously
    sendWelcomeEmail(user).catch((err) =>
      console.warn('[Auth] Async welcome email error on login:', err.message)
    );

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        preferences: user.notificationPreferences,
        createdAt: user.createdAt,
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password credentials');
  }
});

// @desc    Google Sign In / Register via Firebase
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = asyncHandler(async (req, res) => {
  const { email, name, avatar, googleId } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required for Google authentication');
  }

  const normalizedEmail = email.toLowerCase().trim();
  let user = await User.findOne({ email: normalizedEmail });

  if (user) {
    // Update user profile fields if available
    let updated = false;
    if (googleId && !user.googleId) {
      user.googleId = googleId;
      updated = true;
    }
    if (avatar && (!user.avatar || user.avatar.includes('unsplash.com'))) {
      user.avatar = avatar;
      updated = true;
    }
    if (name && (!user.name || user.name === 'User')) {
      user.name = name;
      updated = true;
    }
    if (updated) {
      await user.save();
    }
  } else {
    // Create new user for Google Sign-In
    user = await User.create({
      name: name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      googleId: googleId || undefined,
      authProvider: 'google',
    });
  }

  // Send welcome / login notification email asynchronously
  sendWelcomeEmail(user).catch((err) =>
    console.warn('[Auth] Async welcome email error on Google Auth:', err.message)
  );

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      preferences: user.notificationPreferences,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        preferences: user.notificationPreferences,
        createdAt: user.createdAt,
      },
    });
  } else {
    res.status(404);
    throw new Error('User account not found');
  }
});

