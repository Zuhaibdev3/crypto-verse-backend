import { DatabaseId } from '../../../../types';
import Files from './files.entity';
import { Request, Response } from 'express';

export interface IFilesService {
    upload(req: Request, res: Response, userId: DatabaseId): Promise<string>
    delete(imageUrl: string): Promise<any>
    uploadCheck(imageUrl: string): Promise<any>
    SingleUpload(url: string): Promise<any>
}
