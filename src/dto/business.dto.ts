import { BusinessUpdateInvitePayloadDTO } from "../Interface/payloadInterface";

export interface BusinessUpdateInviteRepoDTO {
  payload: BusinessUpdateInvitePayloadDTO,
  hash: string,
  hashExpirationDate: Date,
  hashExpiration: boolean,
  status: string
}