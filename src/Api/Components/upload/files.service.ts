import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { DatabaseId } from '../../../../types';
import { DataCopier } from "../../../utils/dataCopier";
import { BadRequestError } from '../../../core/ApiError';
import SERVICE_IDENTIFIER from '../../../identifiers';
import { IFilesService } from "./ifiles.service";
import IFilesRepository from "./ifiles.repository";
import { MulterService } from '../multer/multer.service';
import { v2 as cloudinary } from "cloudinary";
import Files from './files.entity';
import axios from 'axios';

@injectable()

export class FilesService implements IFilesService {
  private cloudinary: typeof cloudinary;

  constructor(
    @inject(SERVICE_IDENTIFIER.FilesRepository)
    private FilesRepository: IFilesRepository,
    @inject(SERVICE_IDENTIFIER.MulterService)
    private multerService: MulterService
  ) {
    this.cloudinary = cloudinary;
    this.cloudinary.config({
      cloud_name: 'dq4hz8khk',
      api_key: '586898724224285',
      api_secret: "ip6UDWspgUxon7I72U0XOPx2t1Q"
    });
  }

  async upload(req: Request, res: Response, userId: DatabaseId): Promise<string> {
    try {
      const MulterFileData = await this.multerService.uploadSingle(req, res, 'image');
      const options = {
        folder: 'cryptoverse/images',
        use_filename: true,
        unique_filename: false,
        overwrite: true
      };
      const cloudinaryResponse = await this.cloudinary.uploader.upload(MulterFileData.path, options);
      return cloudinaryResponse?.secure_url
    } catch (error: any) {
      throw new BadRequestError(error.message || "Image Upload Field");
    }
  }
  async SingleUpload(url: string): Promise<string> {
    try {
      const options = {
        folder: 'cryptoverse/imagetoimage',
        use_filename: true,
        unique_filename: false,
        overwrite: true
      };
      const cloudinaryResponse = await this.cloudinary.uploader.upload(url, options);
      return cloudinaryResponse?.secure_url
    } catch (error: any) {
      throw new BadRequestError(error.message || "Image Upload Field");
    }
  }
  async uploadCheck(imageUrl: string): Promise<any> {
    try {
      const imageResponse = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
      });

      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || "");
        });
        imageResponse.data.pipe(stream);
      });
    } catch (error: any) {
      throw new BadRequestError(error.message || "Image Upload Field");
    }
  }



  async delete(imageUrl: string): Promise<string> {
    try {
      const extractedPath = imageUrl.substring(imageUrl.indexOf('/cryptoverse/') + 1)?.split(".")[0];
      const cloudinaryResponse = await this.cloudinary.uploader.destroy(extractedPath);
      console.log(cloudinaryResponse, "cloudinaryResponses")
      return "Deleted"
    } catch (error: any) {
      throw new BadRequestError(error.message || "Image Upload Field");
    }
  }
}
