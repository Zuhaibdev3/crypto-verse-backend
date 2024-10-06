import { DataCopier } from "../../../utils/dataCopier";
import { inject, injectable } from 'inversify';
import { BadRequestError } from '../../../core/ApiError';
import SERVICE_IDENTIFIER from '../../../identifiers';
import { User } from "../user/user.entity";
import { ObjectId } from "mongoose";
import { IndustryPayloadDTO, UpdateIndustryPayloadDTO } from "../../../Interface/payloadInterface";
import { DatabaseId } from "../../../../types";
import { SuperAdminMetaDataDTO } from "../../../dto/index.dto";
import { PaginationDataDTO } from "../../../dto/common.dto";
import { v2 as cloudinary } from "cloudinary";
import { IFilesService } from "./ifiles.service";
import IFilesRepository from "./ifiles.repository";

@injectable()

export class FilesService implements IFilesService {
  private cloudinary: typeof cloudinary; 

  constructor(
    @inject(SERVICE_IDENTIFIER.FilesRepository)
    private FilesRepository: IFilesRepository,
  ) {
    this.cloudinary = cloudinary;  // Assign cloudinary to this.cloudinary if needed
    this.cloudinary.config({
      cloud_name: 'dq4hz8khk',
      api_key: '586898724224285',
      api_secret: "ip6UDWspgUxon7I72U0XOPx2t1Q"
    });
  }

  async upload(ImageUrl: any): Promise<any> {
   
    // const options = {
    //   use_filename: true,
    //   unique_filename: false,
    //   overwrite: true
    // };
    try {
      // let uploadedFile = await this.cloudinary.uploader.upload(fileData?.tempFilePath);
      // console.log(uploadedFile, "uploadedFile")
      // return {
      //   path: uploadedFile.secure_url,
      //   fileSize: uploadedFile.bytes,
      //   fileType: `${uploadedFile.resource_type}/${uploadedFile.format}`,
      //   fileName: uploadedFile.original_filename
      // };
    } catch (error: any) {
      throw new BadRequestError(error.message || "Image Upload Field");
    }
  }



}
