import { Tokens } from "../../../types/app-request";

export class appSigninUserDTO {

  _id : string = '';
  first_name : string = '';
  last_name : string = '';
  role : string = '';
  email : string = '';
  telegram_id : string = '';
  date_of_birth : string = '';
  bio : string = '';
  businessQuestionsAnswered : string = '';
  phone : string = '';
  website : string = '';
  facebook_link : string = '';
  twitter_link : string = '';
  instagram_link : string = '';
  linkedin_link : string = ''
  
}

export class appSigninDTO{
  tokens : Tokens;
  user : appSigninUserDTO
}