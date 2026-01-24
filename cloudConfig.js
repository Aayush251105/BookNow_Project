const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary config = refer docs of cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// multer-storage-cloudinary docs
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'BookNow_DEV',
    allowedFormats: ["png","jpg","jpeg"],
  },
});

module.exports = {
    cloudinary,
    storage,
}