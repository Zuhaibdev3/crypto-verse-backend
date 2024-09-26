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

import { IMidJourneyService } from "./Api/Components/midJourney/imidJourney.service";
import { MidJourneyService } from "./Api/Components/midJourney/midJourney.service";
import IMidJourneyRepository from "./Api/Components/midJourney/imidJourney.repository";
import MidJourneyRepository from "./Api/Components/midJourney/midJourney.repository";



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
  .bind<IMidJourneyService>(SERVICE_IDENTIFIER.MidJourneyService)
  .to(MidJourneyService);
container
  .bind<IMidJourneyRepository>(SERVICE_IDENTIFIER.MidJourneyRepository)
  .to(MidJourneyRepository);


export function resolve<T>(type: symbol): T {
  return container.get<T>(type)
}