require('dotenv').config()

enum ENVIROMENT_TYPE {
  development = "development",
  production = "production",
}

// @ts-ignore
export const environment: ENVIROMENT_TYPE = process.env.NODE_ENV;
// @ts-ignore
export const port: number = process.env.PORT;

export const DATABASE = {
  development: process.env.DB_URI,
  production: process.env.DB_URI,
}

export const env = {
  DB: {
    [ENVIROMENT_TYPE.development]: { uri: process.env.DB_URI },
    [ENVIROMENT_TYPE.production]: { uri: process.env.DB_URI },
  },
  NODE_ENV: process.env.NODE_ENV || "development",
  NODE_PORT: process.env.NODE_PORT || process.env.PORT || 8000,
  API_VERSION: "v1",
  lOGD_IRECTORY: process.env.LOG_DIR || './logs',
};

export const corsUrl: string[] = [""];

export const tokenInfo = {
  accessTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '1d'),
  refreshTokenValidityDays: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '1d'),
  issuer: process.env.DB_URI || 'ZeltaTech',
  audience: process.env.DB_URI || 'ZeltaTech',
};