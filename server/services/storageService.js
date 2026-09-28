import cloudinary from '../config/cloudinary.js';

/**
 * Uploads a file buffer to Cloudinary using an upload stream
 * @param {Buffer} fileBuffer - File buffer from multer memory storage
 * @param {string} folder - Destination folder name in Cloudinary (default: 'warranty-docs')
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadToCloudinary = (fileBuffer, folder = 'warranty-docs') => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new Error('No file buffer provided for Cloudinary upload'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto', // Auto handles both images and PDFs
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Stream Error]:', error);
          return reject(error);
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes a file from Cloudinary by public ID (safely caught without throwing)
 * @param {string} publicId - Cloudinary asset public ID
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn(`[Cloudinary Cleanup Warning] Failed to delete file ${publicId}:`, err.message);
  }
};

export default {
  uploadToCloudinary,
  deleteFromCloudinary,
};
