import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT for the user ID
 * @param {string} userId 
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'expiryguard_default_jwt_secret_amber_pro',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    }
  );
};

export default generateToken;
