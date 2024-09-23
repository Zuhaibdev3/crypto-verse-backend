import { ObjectId } from '../../constants';
import { DatabaseId } from '../../types';
import { Schema } from 'mongoose';

export class AudienceTargeting {
  demoSegmentIds?: string[];
  interestSegmentIds?: string[];
}

// DTO for the campaign plan
export class CampaignPlan {
  campaignName: string;
  campaignGoal: string;
  workspace: Schema.Types.ObjectId;
  audienceTargeting: AudienceTargeting;
  budget: number;
  schedule: {
    startDate: Date;
    endDate: Date;
  };
}

// DTO for native, display, video, and audio ad types
export class AdType {
  adTitle: string;
  adDescription: string;
  url: string;
  filePath: string;
}
export class VideoType {
  videoTitle: string;
  videoDescription: string;
  url: string;
  filePath: string;
}

// DTO for designCampaign in the position
export class DesignCampaign {
  info: {
    jobTitle: string;
    jobDescription: string;
    jobLocation: string;
    employmentType: string;
    jobFunction: string;
    jobLevel: string;
    companyIndustry: string;
    addRequiredSkills: string;
  };
  native: AdType;
  display: AdType;
  video: VideoType;
  audio: AdType;
}

// DTO for the entire MongoDB schema
export class CampaignDTO {
  _id: Schema.Types.ObjectId = new ObjectId('')
  businessId: Schema.Types.ObjectId;
  status: string;
  impression: number;
  reach: number;
  click: number;
  plan: CampaignPlan;
  position: {
    designCampaign: DesignCampaign;
  };
  isDeleted: boolean;
}