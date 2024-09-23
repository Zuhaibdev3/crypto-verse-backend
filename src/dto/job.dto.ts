import { ObjectId } from "../../constants";
import Business from "../Api/Components/business/business.entity";
import { User } from "../Api/Components/user/user.entity";
import { GeoJSONObjectTypes, JobStatus } from "../enums/enums";
import { Schema } from 'mongoose';

export class JobDTO {
  _id :Schema.Types.ObjectId = new ObjectId('')
  applicationQuestions : applicationQuestions = new applicationQuestions() 
  department: string = "";
  enteredInterviewQuestions: string= "";
  jobTitle: string = "";
  jobDescription: string = "";
  jobType: string = "";
  location: string = "";
  openings: number = 1;
  salary: string = "";
  salaryRate: string = "";
  skills: string = "";
  status : string = JobStatus.open;
  businessId : Schema.Types.ObjectId | Business | null = new ObjectId('');
  userId : Schema.Types.ObjectId | User | null = new ObjectId('');
  urlCode : string = "";
}

class applicationQuestions {
  enteredQuestions: string = "" ;
  isCoverLetterRequired: boolean = true ;
  isEmailRequired: boolean = true; 
  isHomeAddressRequired: boolean = true; 
  isNameRequired: boolean = true; 
  isPhoneNumberRequired: boolean = true; 
  isPortfolioLinkRequired: boolean = true; 
  isResumeRequired: boolean = true;  
  isApplicationSourceRequired: boolean = true;  
}

export class JobsTitleDTO {
  _id :Schema.Types.ObjectId = new ObjectId('')
  jobTitle: string = "";
}
