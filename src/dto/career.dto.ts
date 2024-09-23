import { GetSSOLinkResponse } from "@dudadev/partner-api/dist/types/lib/accounts/types";
import { ObjectId } from "../../constants";
import Business from "../Api/Components/business/business.entity";
import { User } from "../Api/Components/user/user.entity";
import { GeoJSONObjectTypes, JobStatus } from "../enums/enums";
import { Schema } from 'mongoose';
import { SiteNamedResponse } from "@dudadev/partner-api/dist/types/lib/sites/types";


class template_properties {
  can_build_from_url?: boolean = false
  type?: string = ''
  has_store?: boolean = false
  has_blog?: boolean = false
  page_count?: number = 0
  visibility?: string = ''
}

export class CareerTemplateDTO {
  template_name?: string = ''
  preview_url?: string = ''
  thumbnail_url?: string = ''
  desktop_thumbnail_url?: string = ''
  tablet_thumbnail_url?: string = ''
  mobile_thumbnail_url?: string = ''
  template_id?: number = 0
  base_site_name?: string = ''
  template_properties?: template_properties = new template_properties()
}

// interface CareerAccountDTO {
//   businessId: string;
//   accountName: string;
//   accountType: 'CUSTOMER';
//   userId: string;
//   createdBy: string;
//   modifiedBy: string;
//   isDeleted: boolean;
// }

export class GetCareerTemplateDTO {
  templates: CareerTemplateDTO[]
}

export class AddNewCareerSiteDTO {
  createdSSOLink: GetSSOLinkResponse
  permission: void
  createdAccount: void
  createSite: SiteNamedResponse
}

// class applicationQuestions {

// }