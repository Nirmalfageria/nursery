import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// ✅ Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // ✅ Extract public ID from image URL
    const publicId = extractPublicId(imageUrl);

    if (!publicId) {
      return NextResponse.json({ error: 'Failed to extract public ID' }, { status: 400 });
    }

    // ✅ Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}

// 🛠️ Helper: Extract Cloudinary public ID from full URL
function extractPublicId(imageUrl) {
  try {
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = filename.split('.')[0];
    const folder = urlParts.slice(-2)[0];
    return `${folder}/${publicId}`;
  } catch (err) {
    console.error("Error extracting publicId:", err);
    return null;
  }
}
