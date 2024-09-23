import { Request } from "express"
import File, { FileModel } from '../model/File';
import { v2 as cloudinary } from "cloudinary";
import { BadRequestError } from '../../core/ApiError';

interface EditorResponse {
  success: 1,
  file: { url: string }
}

export default class FileRepo {

  public static async create(req: Request): Promise<{ file: File }> {
    const fileData: any = req.files;

    cloudinary.config({
      cloud_name: 'dairwfrpv',
      api_key: '759452217818743',
      api_secret: 'EhXhgDvwK_vZbmhFVjgpeErMfvc'
    });
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true
    };
    try {
      const uploadedFile = await cloudinary.uploader.upload(fileData.file.path, options);
      const file = await FileModel.create({
        path: uploadedFile.secure_url,
        fileSize: fileData.file.size,
        fileType: fileData.file.type,
        fileName: fileData.file.name
      });
      return { file };
    } catch (error: any) {
      throw new BadRequestError(error.message || "Image Upload Field");
    }
  }


  public static async createForEditor(req: Request): Promise<EditorResponse> {
    const fileData: any = req.files;
    cloudinary.config({
      cloud_name: 'dairwfrpv',
      api_key: '759452217818743',
      api_secret: 'EhXhgDvwK_vZbmhFVjgpeErMfvc'
    });
    try {
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true
      };
      const uploadedFile = await cloudinary.uploader.upload(fileData.image.path, options);
      const file = await FileModel.create({
        path: uploadedFile.secure_url,
        fileSize: fileData.image.size,
        fileType: fileData.image.type,
        fileName: fileData.image.name
      });
      
      return {
        success: 1,
        file: {
          url: file.path || "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg",
        }
      }
    } catch (error: any) {
      throw new BadRequestError(error.message || "Image Upload Field");
    }
  }

}