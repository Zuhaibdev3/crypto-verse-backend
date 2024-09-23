import { AppSigninPayloadDTO } from '../../../Interface/payloadInterface/Access';
import { Tokens } from 'app-request';
import { appSigninUserDTO, appSigninDTO } from './access.dto';
import { User } from '../user/user.entity';

export interface IAccessService {

  appSignin(bodyData : AppSigninPayloadDTO): Promise<appSigninDTO>

  generate(type: 'SIGNUP' | 'SIGNIN', user: User): Promise<{ tokens: Tokens, user: User }>
}
