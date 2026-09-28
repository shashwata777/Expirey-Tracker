import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Handle demo tokens gracefully
      if (token.startsWith('demo-jwt-token')) {
        let user = await User.findOne({ email: 'alexander.vance@expiryguard.io' });
        if (!user) {
          user = await User.create({
            name: 'Alexander Vance',
            email: 'alexander.vance@expiryguard.io',
            password: 'password123',
            role: 'Pro Member',
          });
        }
        req.user = user;
        return next();
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'expiryguard_default_jwt_secret_amber_pro'
      );

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401);
        throw new Error('User account not found or deactivated');
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, session expired or invalid token');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, missing bearer token');
  }
});

export default protect;
