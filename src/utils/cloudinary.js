import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Debug: Show actual values being used
console.log('Actual Cloudinary Config:', {
  cloud_name:"dsev5t0of",
  api_key:"825259773958718",
  api_secret:"cYY52xbwOShHOjxi8-HHTSwieCY" // This line shows the typo 
});

// Initialize with proper error checking
// if (!process.env.CLOUDINARY_CLOUD_NAME || 
//     !process.env.CLOUDINARY_API_KEY || 
//     !process.env.CLOUDINARY_API_SECRET) {
//   throw new Error('Cloudinary configuration incomplete');
// }

cloudinary.config({ 
  cloud_name:"dsev5t0of",
  api_key:"825259773958718",
  api_secret:"cYY52xbwOShHOjxi8-HHTSwieCY" // Corrected property name
});

const cloudinaryUploader= async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    // Verify file exists
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`File not found: ${localFilePath}`);
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error('Cloudinary upload failed:', {
      error: error.message,
      config: cloudinary.config()
    });
    return null;
  }
};

export default cloudinaryUploader;