import { Tokens } from 'app-request';
import { AuthFailureError, InternalError } from '../core/ApiError';
import JWT, { JwtPayload } from '../core/JWT';
import { Types } from 'mongoose';
import { tokenInfo } from '../config/globals';
import { User } from '..//Api/Components/user/user.entity';

export const getAccessToken = (authorization?: string) => {
  if (!authorization) throw new AuthFailureError('Invalid Authorization');
  if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Authorization');
  return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
  if (
    !payload ||
    !payload.iss ||
    !payload.sub ||
    !payload.aud ||
    !payload.prm ||
    payload.iss !== tokenInfo.issuer ||
    payload.aud !== tokenInfo.audience ||
    !Types.ObjectId.isValid(payload.sub)
  )
    throw new AuthFailureError('Session Expired Please Login Again');
  return true;
};

export const createTokens = async (
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<Tokens> => {
  const accessToken = await JWT.encode(
    // @ts-ignore
    new JwtPayload(tokenInfo.issuer, tokenInfo.audience, user._id.toString(), accessTokenKey, tokenInfo.accessTokenValidityDays),
  );

  if (!accessToken) throw new InternalError();

  const refreshToken = await JWT.encode(
    // @ts-ignore
    new JwtPayload(tokenInfo.issuer,tokenInfo.audience,user._id.toString(),refreshTokenKey,tokenInfo.refreshTokenValidityDays,),
  );

  if (!refreshToken) throw new InternalError();

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  } as Tokens;
};
