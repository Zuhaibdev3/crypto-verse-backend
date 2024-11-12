import { IStabilityaiService } from './istabilityai.service';
import { inject, injectable } from 'inversify';
import { BadRequestError } from '../../../core/ApiError';
import { DatabaseId } from '../../../../types';
import SERVICE_IDENTIFIER from '../../../identifiers';
import axios from "axios";
import { FilesService } from "../upload/files.service";
import { MulterService } from "../multer/multer.service";
import { Request, Response } from 'express';
import FormData from 'form-data';
import fs from 'node:fs';
import { NftService } from '../nft/nft.service';
import { TextToImagePayloadDTO } from '../../../Interface/payloadInterface';

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
    private FilesService: FilesService,
    @inject(SERVICE_IDENTIFIER.NftService)
    private NftService: NftService
  ) { }

  async ImageToImageGeneration(req: Request, res: Response, userId: DatabaseId, walletAddress: string): Promise<any> {
    try {
      const MulterFileData = await this.multerService.uploadSingle(req, res, 'image');
      const { imageMode, strength, step, seed, style, scale, quantity, positivePrompt, negativePrompt } = req.body;
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
      // if (style !== "None" || style?.length) {
      //   formData.append('style_preset', style);
      // }
      if (negativePrompt?.length) {
        formData.append('text_prompts[1][text]', negativePrompt);
        formData.append('text_prompts[1][weight]', -1);
      }


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
        const url = await this.FilesService.SingleUpload(imageUrl, "/imagetoimage");
        return {
          url: url,
          prompt: positivePrompt,
          walletAddress: walletAddress
        };
      }));
      const result = await this.NftService.addMultiple(uploadedUrls, { createdBy: userId, updatedBy: userId, updatedAt: new Date(), });
      return result;
    } catch (error) {
      console.log(error, "error");
      throw new BadRequestError('Failed to generate image');
    }
  }
  async TextToImageGeneration(body: TextToImagePayloadDTO, userId: DatabaseId, walletAddress: string): Promise<any> {
    try {

      const response = await axios.post("https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image ", body, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.STABILITY_AI}`,
        },
      });

      const responseJSON = response.data as GenerationResponse;
      const uploadedUrls = await Promise.all(responseJSON.artifacts.map(async (artifact: any) => {
        const image = artifact.base64;
        const imageUrl = `data:image/png;base64,${image}`;
        const url = await this.FilesService.SingleUpload(imageUrl, "/texttoimage");
        return {
          url: url,
          prompt: body.text_prompts[0].text,
          walletAddress: walletAddress
        };
      }));
      const result = await this.NftService.addMultiple(uploadedUrls, { createdBy: userId, updatedBy: userId, updatedAt: new Date(), });
      return result;
    } catch (error) {
      console.log(error, "error");
      throw new BadRequestError('Failed to generate image');
    }
  }
}