import { Tokens } from "../../../types/app-request";

export class appSigninUserDTO {
  _id : string = '';
  role : string = '';
  email : string = '';
}

export class appSigninDTO{
  tokens : Tokens;
  user : appSigninUserDTO
}