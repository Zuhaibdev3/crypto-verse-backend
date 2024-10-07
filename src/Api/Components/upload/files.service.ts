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

  async upload(req: Request, res: Response, userId: DatabaseId): Promise<Files> {
    try {
      const MulterFileData = await this.multerService.uploadSingle(req, res, 'image');
      const options = {
        folder: 'uploads/images',
        use_filename: true,
        unique_filename: false,
        overwrite: true
      };
      const cloudinaryResponse = await this.cloudinary.uploader.upload(MulterFileData.path,options);
      const FileData = DataCopier.copy(Files, {
        userId: userId,
        name: cloudinaryResponse?.original_filename,
        path: cloudinaryResponse?.secure_url,
        fileName: cloudinaryResponse?.display_name,
        fileSize: cloudinaryResponse?.bytes?.toString(),
        fileType: cloudinaryResponse?.format,
      })
      return await this.FilesRepository.create(FileData)
    } catch (error: any) {
      throw new BadRequestError(error.message || "Image Upload Field");
    }
  }



}
