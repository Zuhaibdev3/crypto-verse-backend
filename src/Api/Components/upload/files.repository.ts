import Files, { FilesModal } from './files.entity';
import IFilesRepository from './ifiles.repository';
import Repository from '../../../repository/repository';
import { injectable } from 'inversify';
import { DatabaseId } from '../../../../types';


@injectable()
export default class FilesRepository extends Repository<Files> implements IFilesRepository {
  model = FilesModal

}
