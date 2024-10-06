import "reflect-metadata";

import { generateTokenKey } from "../../../helpers/tokenKeyGenerator";
import { createTokens, } from '../../../utils/authUtils';
import { Tokens } from 'app-request';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import { inject, injectable } from 'inversify';
import SERVICE_IDENTIFIER from "../../../identifiers";
import { IAccessService } from './iaccess.service';
import IUserRepo from '../../../database/repository/iuser.repository';
import _ from 'lodash';
import { User } from "../user/user.entity";
import { DataCopier } from "../../../utils/dataCopier";

@injectable()
export class AccessService implements IAccessService {

  constructor(
    @inject(SERVICE_IDENTIFIER.UserRepo)
    private userRepository: IUserRepo,

  ) { }

  async generate(type: 'SIGNUP' | 'SIGNIN', user: User): Promise<{ tokens: Tokens, user: User }> {
    const accessTokenKey = generateTokenKey();
    const refreshTokenKey = generateTokenKey();
    console.log(user, "user")
    const userData = DataCopier.copy(User, user)
    console.log(userData, "userData")
    if (type === 'SIGNUP') {
      const { user: createdUser } = await this.userRepository.create(
        userData,
        accessTokenKey,
        refreshTokenKey,
        // @ts-ignore
        user.role,
      );
      user = createdUser
    }
    console.log(user, "useruseruseruseruseruser")
    //@ts-ignore
    const keystore = await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, { ip: "0.0.0.0" }, keystore.primaryKey, keystore.secondaryKey);
    return { tokens, user: user };
  }


}
