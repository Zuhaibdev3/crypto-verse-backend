import { Router } from 'express';
import authentication from '../../../middleware/authentication';
import { TextToImageValidationSchema } from '../../../validations/payloadSchema/StabilitySchema';
import validator, { ValidationSource } from '../../../validations/validator';

import { StabilityaiController } from './istabilityai.controller';
export class StabilityaiRoutes {

  readonly router: Router = Router();
  readonly controller: StabilityaiController = new StabilityaiController()

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {

    this.router.post(
      '/imagetoimage',
      authentication,
      // validator(DalleValidationSchema),
      this.controller.ImageToImageGeneration
    )
    this.router.post(
      '/texttoimage',
      authentication,
      validator(TextToImageValidationSchema),
      this.controller.TextToImageGeneration
    )
    // this.router.get(
    //   '/',
    //   authentication,
    //   this.controller.getAllforAdmin
    // )

    // this.router.get(
    //   '/',
    //   authentication,
    //   this.controller.getAllforUser
    // )

    // this.router.get(
    //   '/:industryId',
    //   authentication,
    //   validator(IndustryIdParamSchema, ValidationSource.PARAM),
    //   this.controller.get
    // )

    // this.router.put(
    //   '/:industryId',
    //   authentication,
    //   validator(IndustryIdParamSchema, ValidationSource.PARAM),
    //   validator(UpdateIndustryValidationSchema),
    //   this.controller.update
    // )

    // this.router.delete(
    //   '/:industryId',
    //   authentication,
    //   validator(IndustryIdParamSchema, ValidationSource.PARAM),
    //   this.controller.delete
    // )

  }

}
