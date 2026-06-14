import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadsService {
  private cloudinaryConfigured: boolean;

  constructor() {
    const name = process.env.CLOUDINARY_CLOUD_NAME;
    const key = process.env.CLOUDINARY_API_KEY;
    const secret = process.env.CLOUDINARY_API_SECRET;
    this.cloudinaryConfigured = !!(name && key && secret && name !== 'your-cloud-name');
    if (this.cloudinaryConfigured) {
      cloudinary.config({ cloud_name: name, api_key: key, api_secret: secret });
    }
  }

  private async uploadFromBuffer(file: Express.Multer.File): Promise<any> {
    if (!this.cloudinaryConfigured) {
      return {
        secure_url: `https://placehold.co/800x800/EEE/31343C?text=${encodeURIComponent(file.originalname || 'image')}`,
        public_id: `placeholder-${Date.now()}`,
        width: 800,
        height: 800,
        format: 'png',
        bytes: 0,
      };
    }
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    return cloudinary.uploader.upload(dataURI, {
      folder: 'tolumak',
      resource_type: 'auto',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, WebP, and GIF allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File too large. Maximum size is 5MB');
    }

    const result = await this.uploadFromBuffer(file);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    };
  }

  async uploadImages(files: Express.Multer.File[]) {
    if (!files || files.length === 0) throw new BadRequestException('No files provided');
    if (files.length > 10) throw new BadRequestException('Maximum 10 files allowed');

    const results = await Promise.all(files.map((file) => this.uploadImage(file)));
    return { images: results };
  }

  async uploadVideo(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    const allowedMimes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only MP4, MOV, WebM, and AVI allowed');
    }

    if (file.size > 100 * 1024 * 1024) {
      throw new BadRequestException('File too large. Maximum size is 100MB');
    }

    if (!this.cloudinaryConfigured) {
      return {
        url: `/placeholder.svg`,
        publicId: `placeholder-${Date.now()}`,
      };
    }

    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'tolumak',
      resource_type: 'video',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      duration: result.duration,
    };
  }

  async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return { message: 'Image deleted successfully', result };
    } catch {
      throw new BadRequestException('Failed to delete image');
    }
  }
}
