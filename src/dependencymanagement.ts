import "reflect-metadata";
import { Container } from "inversify";
import SERVICE_IDENTIFIER from "./identifiers";
import { IDataManipulationService } from './Services/interfaces/idataManipulation.service';
import { DataManipulationService } from './Services/implementations/dataManipulation.service';
import { IAccessService } from './Api/Components/access/iaccess.service';
import { AccessService } from './Api/Components/access/access.service';
import IUserRepo from './database/repository/iuser.repository';
import UserRepo from "./database/repository/UserRepo";
import UserRepository from "./Api/Components/user/user.repository";
import IUserRepository from "./Api/Components/user/iuser.repository";
import { IUserService } from './Api/Components/user/iuser.service';
import { UserService } from './Api/Components/user/user.service';
import { ITokenService } from "./Services/interfaces/itoken.service";
import { TokenService } from "./Services/implementations/token.service";
import { IIndustryService } from "./Api/Components/industry/iindustry.service";
import { IndustryService } from "./Api/Components/industry/industry.service";
import IIndustryRepository from "./Api/Components/industry/iindustry.repository";
import IndustryRepository from "./Api/Components/industry/industry.repository";

import { IDalleService } from "./Api/Components/dalle/idalle.service";
import { DalleService } from "./Api/Components/dalle/dalle.service";
import IDalleRepository from "./Api/Components/dalle/idalle.repository";
import DalleRepository from "./Api/Components/dalle/dalle.repository";
import { IFilesService } from "./Api/Components/upload/ifiles.service";
import { FilesService } from "./Api/Components/upload/files.service";
import IFilesRepository from "./Api/Components/upload/ifiles.repository";
import FilesRepository from "./Api/Components/upload/files.repository";
import { MulterService } from './Api/Components/multer/multer.service';


import { IStabilityaiService } from "./Api/Components/stabilityai/istabilityai.service";
import { StabilityaiService } from "./Api/Components/stabilityai/stabilityai.service";
import IStabilityaiRepository from "./Api/Components/stabilityai/istabilityai.repository";
import StabilityaiRepository from "./Api/Components/stabilityai/stabilityai.repository";


import { INftService } from "./Api/Components/nft/inft.service";
import { NftService } from "./Api/Components/nft/nft.service";
import INftRepository from "./Api/Components/nft/inft.repository";
import NftRepository from "./Api/Components/nft/nft.repository";

let container = new Container();
container
  .bind<IDataManipulationService>(SERVICE_IDENTIFIER.DataManipulationService)
  .to(DataManipulationService);

container
  .bind<IAccessService>(SERVICE_IDENTIFIER.AccessService)
  .to(AccessService);

container
  .bind<IUserRepo>(SERVICE_IDENTIFIER.UserRepo)
  .to(UserRepo);
container
  .bind<IUserRepository>(SERVICE_IDENTIFIER.UserRepository)
  .to(UserRepository);
container
  .bind<IUserService>(SERVICE_IDENTIFIER.UserService)
  .to(UserService);
container
  .bind<ITokenService>(SERVICE_IDENTIFIER.TokenService)
  .to(TokenService);
container
  .bind<IIndustryService>(SERVICE_IDENTIFIER.IndustryService)
  .to(IndustryService);
container
  .bind<IIndustryRepository>(SERVICE_IDENTIFIER.IndustryRepository)
  .to(IndustryRepository);

container
  .bind<IDalleService>(SERVICE_IDENTIFIER.DalleService)
  .to(DalleService);
container
  .bind<IDalleRepository>(SERVICE_IDENTIFIER.DalleRepository)
  .to(DalleRepository);

container
  .bind<IStabilityaiService>(SERVICE_IDENTIFIER.StabilityaiService)
  .to(StabilityaiService);

container
  .bind<IStabilityaiRepository>(SERVICE_IDENTIFIER.StabilityaiRepository)
  .to(StabilityaiRepository);

container
  .bind<MulterService>(SERVICE_IDENTIFIER.MulterService)
  .to(MulterService);

container
  .bind<IFilesService>(SERVICE_IDENTIFIER.FilesService)
  .to(FilesService);

container
  .bind<IFilesRepository>(SERVICE_IDENTIFIER.FilesRepository)
  .to(FilesRepository);

  container
  .bind<INftService>(SERVICE_IDENTIFIER.NftService)
  .to(NftService);

container
  .bind<INftRepository>(SERVICE_IDENTIFIER.NftRepository)
  .to(NftRepository);



export function resolve<T>(type: symbol): T {
  return container.get<T>(type)
}