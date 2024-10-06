
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
      console.log("zuhaib")
      const files = req.files
      const uploaded = await this.filesService.upload(req?.files)

      new SuccessResponse('Image Upload successfully', { res: "zuhaib" }).send(res)
    })

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