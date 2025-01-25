import { Router } from 'express';
import RoleRepo from './role.repository';
import validator, { ValidationSource } from '../../../validations/validator';
import authentication from '../../../middleware/authentication';
import { IndustryIdParamSchema, IndustryValidationSchema, UpdateIndustryValidationSchema } from '../../../validations/payloadSchema/IndustrySchema';

export class RoleRoutes {

  readonly router: Router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {

    this.router.post(
      '/',
      // authentication,
      // validator(IndustryValidationSchema),
      RoleRepo.create
    )

  }

}
