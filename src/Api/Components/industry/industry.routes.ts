import { Router } from 'express';
import { IndustryController } from './industry.controller';
import validator, { ValidationSource } from '../../../validations/validator';
import authentication from '../../../middleware/authentication';
import { IndustryIdParamSchema, IndustryValidationSchema, UpdateIndustryValidationSchema } from '../../../validations/payloadSchema/IndustrySchema';
import authorization from '../../../middleware/authorization';
import { RoleCode } from '../../../database/model/Role';

export class IndustryRoutes {

  readonly router: Router = Router();
  readonly controller: IndustryController = new IndustryController()

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {

    this.router.post(
      '/',
      authentication,
      validator(IndustryValidationSchema),
      this.controller.add
    )
    
    this.router.get(
      '/admin',
      authentication,
      this.controller.getAllforAdmin
    )

    this.router.get(
      '/',
      authentication,
      this.controller.getAll
    )

    this.router.get(
      '/:industryId',
      authentication,
      validator(IndustryIdParamSchema, ValidationSource.PARAM),
      this.controller.get
    )

    this.router.put(
      '/:industryId',
      authentication,
      validator(IndustryIdParamSchema, ValidationSource.PARAM),
      validator(UpdateIndustryValidationSchema),
      this.controller.update
    )

    this.router.delete(
      '/:industryId',
      authentication,
      validator(IndustryIdParamSchema, ValidationSource.PARAM),
      this.controller.delete
    )

  }

}
