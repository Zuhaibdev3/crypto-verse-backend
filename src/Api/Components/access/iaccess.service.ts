import { Tokens } from 'app-request';
import { User } from '../user/user.entity';

export interface IAccessService {
  generate(type: 'SIGNUP' | 'SIGNIN', user: User): Promise<{ tokens: Tokens, user: User }>
}
