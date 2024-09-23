import { IJWTOtions } from "../../Interface"
import { generateTokenDataDTO } from "../dto/token.dto"


export interface ITokenService {
  generateTokenForOTP(body: generateTokenDataDTO, expiresInMinutes: number): Promise<string>
  verifyToken(token: string): Promise<any>,
  generateToken(body: object, tokenSecret? : string, options?: IJWTOtions) : Promise<string>
}
