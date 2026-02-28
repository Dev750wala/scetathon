import { v2 as cloudinary } from 'cloudinary';

export function configureCloudinary(): void {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImage(filePath: string, folder: string = 'swachh-campus'): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'image',
  });
  return result.secure_url;
}

export async function uploadBuffer(buffer: Buffer, folder: string = 'swachh-campus'): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    ).end(buffer);
  });
}

export { cloudinary };
