import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    if (req.body.email) {
      const emailLower = req.body.email.toLowerCase();
      // Check if email already taken by someone else
      if (emailLower !== user.email) {
        const existing = await User.findOne({ email: emailLower });
        if (existing) {
          res.status(400);
          throw new Error('Email address is already in use');
        }
      }
      user.email = emailLower;
    }
    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        preferences: updatedUser.notificationPreferences,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide both current and new password');
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully',
  });
});

// @desc    Update user notification preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { preferences } = req.body;
  if (preferences) {
    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...preferences,
    };
    await user.save();
  }

  res.json({
    success: true,
    preferences: user.notificationPreferences,
  });
});
