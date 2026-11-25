import 'server-only';
import { v2 as cloudinary } from 'cloudinary';

let configured = false;

export function getCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error('Cloudinary is not configured.');
  }
  if (!configured) {
    cloudinary.config({ cloud_name, api_key, api_secret });
    configured = true;
  }
  return cloudinary;
}

export default {
  uploader: {
    upload(...args) {
      return getCloudinary().uploader.upload(...args);
    },
  },
};
