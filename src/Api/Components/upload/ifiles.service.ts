import { DatabaseId } from '../../../../types';
import Files from './files.entity';
import { Request, Response } from 'express';

export interface IFilesService {
    upload(req: Request, res: Response, userId: DatabaseId): Promise<Files>

}
