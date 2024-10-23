import { IStabilityaiService } from './istabilityai.service';
import { inject, injectable } from 'inversify';
import { BadRequestError } from '../../../core/ApiError';
import SERVICE_IDENTIFIER from '../../../identifiers';
import axios from "axios";
import { FilesService } from "../upload/files.service";
import { MulterService } from "../multer/multer.service";
import { Request, Response } from 'express';
import FormData from 'form-data';
import fs from 'node:fs';

interface GenerationResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}


@injectable()
export class StabilityaiService implements IStabilityaiService {

  constructor(
    @inject(SERVICE_IDENTIFIER.MulterService)
    private multerService: MulterService,
    @inject(SERVICE_IDENTIFIER.FilesService)
    private FilesService: FilesService
  ) { }

  async ImageToImageGeneration(req: Request, res: Response): Promise<any> {
    try {
      const MulterFileData = await this.multerService.uploadSingle(req, res, 'image');
      const { imageMode, strength, step, seed, style, scale, quantity, positivePrompt, negativePrompt } = req.body;
      console.log(positivePrompt, "strength")
      const formData = new FormData();
      formData.append('init_image', fs.readFileSync(MulterFileData.path));
      formData.append('init_image_mode', imageMode);
      formData.append('image_strength', Number(strength));
      formData.append('steps', Number(step));
      formData.append('seed', Number(seed));
      formData.append('cfg_scale', Number(scale));
      formData.append('samples', Number(quantity));
      formData.append('text_prompts[0][text]', positivePrompt);
      formData.append('text_prompts[0][weight]', 1);
      if (style !== "None") {
        formData.append('style_preset', style);
      }
      if (negativePrompt?.length) {
        formData.append('text_prompts[1][text]', negativePrompt);
        formData.append('text_prompts[1][weight]', -1);
      }

      console.log(formData, "formData")

      const response = await axios.post("https://api.stability.ai/v1/generation/stable-diffusion-v1-6/image-to-image", formData, {
        headers: {
          ...formData.getHeaders(),
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.STABILITY_AI}`,
        },
      });

      const responseJSON = response.data as GenerationResponse;

      const uploadedUrls = await Promise.all(responseJSON.artifacts.map(async (artifact: any) => {
        const image = artifact.base64;
        const imageUrl = `data:image/png;base64,${image}`;
        return await this.FilesService.SingleUpload(imageUrl);
      }));

      return { urls: uploadedUrls };
    } catch (error) {
      console.log(error, "error");
      throw new BadRequestError('Failed to generate image');
    }
  }

}