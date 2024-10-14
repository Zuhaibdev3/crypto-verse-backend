
import { Response, Request, NextFunction } from "express"
import asyncHandler from "../../../helpers/async";
import { SuccessResponse, SuccessMsgResponse } from '../../../core/ApiResponse';
import { resolve } from "../../../dependencymanagement"
import { IFilesService } from "./ifiles.service";
import SERVICE_IDENTIFIER from "../../../identifiers";

export class FileController {

  getFilesService(): IFilesService {
    return resolve<IFilesService>(SERVICE_IDENTIFIER.FilesService);
  }

  filesService = this.getFilesService();

  uploadOnCloudinary = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      let { _id: userId } = req.user
      const UploadedImage = await this.filesService.upload(req, res, userId);
      return new SuccessResponse('Image uploaded successfully', { imageUrl: UploadedImage }).send(res);
    }
  );
  deletefromCloudinary = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      let { imageUrl } = req.body
      const UploadedImage = await this.filesService.delete(imageUrl);
      return new SuccessResponse('Image uploaded successfully', { imageUrl: UploadedImage }).send(res);
    }
  );


  // imageUpload = asyncHandler(
  //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     const uploaded: CloudinaryResponse = await this.uploadOnCloudinary(req)
  //     const { file } = await FileRepo.create(uploaded);
  //     new SuccessResponse('Added successfully', file).send(res);
  //   }
  // )

  // imageUploadForEditor = asyncHandler(
  //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
  //     const uploaded: CloudinaryResponse = await this.uploadOnCloudinary(req)
  //     const { file } = await FileRepo.create(uploaded);
  //     res.send({
  //       success: 1,
  //       file: {
  //         url: file.path,
  //       }
  //     });
  //   }
  // )



}