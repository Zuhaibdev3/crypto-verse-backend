import { Router } from 'express';
import {  MidJourneyController } from './midJourney.controller';
import validator, { ValidationSource } from '../../../validations/validator';
import authentication from '../../../middleware/authentication';
import authorization from '../../../middleware/authorization';
import { RoleCode } from '../../../database/model/Role';
import { MidJourneyValidationSchema } from '../../../validations/payloadSchema/MidJourneySchema';

export class MidJourneyRoutes {

  readonly router: Router = Router();
  readonly controller: MidJourneyController = new MidJourneyController()

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {

    this.router.post(
      '/',
      // authentication,
      validator(MidJourneyValidationSchema),
      this.controller.generateImage
    )
    
    // this.router.get(
    //   '/admin',
    //   authentication,
    //   this.controller.getAllforAdmin
    // )

    // this.router.get(
    //   '/',
    //   authentication,
    //   this.controller.getAll
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
