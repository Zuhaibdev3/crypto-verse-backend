import Nft, {  NftModal } from './nft.entity';
import INftRepository from './inft.repository';
import Repository from '../../../repository/repository';
import { injectable } from 'inversify';
import { DatabaseId } from '../../../../types';


@injectable()
export default class NftRepository extends Repository<Nft> implements INftRepository {
  model = NftModal

}
