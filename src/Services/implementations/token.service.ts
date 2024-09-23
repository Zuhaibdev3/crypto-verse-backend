import jwt from 'jsonwebtoken';
import { injectable } from 'inversify';
import { ITokenService } from '../interfaces/itoken.service';
import { generateTokenDataDTO } from '../dto/token.dto';
import { IJWTOtions } from '../../Interface';
import { BadRequestError } from '../../core/ApiError';

@injectable()
export class TokenService implements ITokenService {
  private readonly secret = 'fiedgfoigewfgbirefobueriw';

  async generateTokenForOTP(body: generateTokenDataDTO, expiresInMinutes: number): Promise<string> {
    return this.generateToken(body, null ,{expiresIn : expiresInMinutes})
  }

  async generateToken(payload: object, tokenSecret? : string | null, options?: IJWTOtions): Promise<string> {
    const secret = tokenSecret || this.secret 
    return jwt.sign({ ...payload }, secret, options);

  }

  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      console.log('error ', error);
      throw new BadRequestError('Invalid token')
    }
  }
}
