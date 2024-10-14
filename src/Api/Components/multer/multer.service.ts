import { injectable } from 'inversify';
import { BadRequestError } from '../../../core/ApiError';
import { Request, Response } from 'express';
import multer from 'multer';

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string; 
}
@injectable()
export class MulterService {
  private upload: multer.Multer;

  constructor() {
    const storage = multer.diskStorage({
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      }
    });
    this.upload = multer({
      storage: storage,
      limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
    });
  }

  async uploadSingle(req: Request, res: Response, fieldName: string): Promise<UploadedFile> {
    return new Promise((resolve, reject) => {
      this.upload.single(fieldName)(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
          return reject(new BadRequestError('Multer Error: ' + err.message));
        } else if (err) {
          return reject(new BadRequestError('File upload failed: ' + err.message));
        }
        if (!req.file) {
          return reject(new BadRequestError('No file uploaded'));
        }
        resolve(req.file); 
      });
    });
  }

  // Optional: You can uncomment and use this for multiple file uploads
  public uploadMultiple(req: Request, res: Response, fieldName: string, maxCount: number) {
    return new Promise((resolve, reject) => {
      this.upload.array(fieldName, maxCount)(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
          reject(new BadRequestError('Multer Error: ' + err.message));
        } else if (err) {
          reject(new BadRequestError('File upload failed: ' + err.message));
        } else {
          resolve(req.files); // Return the files array
        }
      });
    });
  }
}
