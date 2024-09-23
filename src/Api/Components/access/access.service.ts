import "reflect-metadata";

import { generateTokenKey } from "../../../helpers/tokenKeyGenerator";
import { createTokens, getAccessToken, validateTokenData } from '../../../utils/authUtils';
import { Tokens } from 'app-request';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import { inject, injectable } from 'inversify';
import SERVICE_IDENTIFIER from "../../../identifiers";
import { IAccessService } from './iaccess.service';
import { AppSigninPayloadDTO as AppSigninDTO, AppSigninPayloadDTO } from '../../../Interface/payloadInterface';
import IUserRepo from '../../../database/repository/iuser.repository';
import { BadRequestError } from '../../../core/ApiError';
import { comparePassword } from '../../../utils/password';
import Logger from '../../../core/Logger';
import _ from 'lodash';
import { appSigninUserDTO, appSigninDTO } from './access.dto';
import { DataCopier } from '../../../utils/dataCopier';
import { User } from "../user/user.entity";

@injectable()
export class AccessService implements IAccessService {

  constructor(
    @inject(SERVICE_IDENTIFIER.UserRepo)
    private userRepository: IUserRepo,

  ) {}

  async generate(type: 'SIGNUP' | 'SIGNIN', user: User): Promise<{ tokens: Tokens, user: User }> {
    const accessTokenKey = generateTokenKey();
    const refreshTokenKey = generateTokenKey();
    if (type === 'SIGNUP') {
      const { user: createdUser } = await this.userRepository.create(
        user as User,
        accessTokenKey,
        refreshTokenKey,
        // @ts-ignore
        user.role,
      );
      user = createdUser
    }
    //@ts-ignore
    const keystore = await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, { ip: "0.0.0.0" }, keystore.primaryKey, keystore.secondaryKey);
    return { tokens, user: user };
  }

  async appSignin(bodyData: AppSigninPayloadDTO): Promise<appSigninDTO> {

    const user = await this.userRepository.findByEmail(bodyData.email);
    if (!user) throw new BadRequestError('Invalid credentials');
    if (!user.password || !user.email) throw new BadRequestError('Credential not set');
    comparePassword(bodyData.password, user.password)
    const { tokens } = await this.generate('SIGNIN', user as User)
    const userData = DataCopier.copy(appSigninUserDTO, user)
    const result: appSigninDTO = { user: userData, tokens: tokens }
    Logger.info("Login Success", result)
    return result
  }
}
