import { Router } from 'express';
import { NftController } from './nft.controller';
import validator, { ValidationSource } from '../../../validations/validator';
import authentication from '../../../middleware/authentication';
import { IndustryIdParamSchema, IndustryValidationSchema, UpdateIndustryValidationSchema } from '../../../validations/payloadSchema/IndustrySchema';
import authorization from '../../../middleware/authorization';
import { RoleCode } from '../../../database/model/Role';
import { NftLikeSchema } from '../../..//validations/payloadSchema/NftSchema';

export class NftRoutes {

  readonly router: Router = Router();
  readonly controller: NftController = new NftController()

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {
    // this.router.post(
    //   '/',
    //   authentication,
    //   // validator(DalleValidationSchema),
    //   this.controller.ImageToImageGeneration
    // )

    // this.router.post(
    //   '/',
    //   authentication,
    //   validator(IndustryValidationSchema),
    //   this.controller.add
    // )

    // this.router.get(
    //   '/admin',
    //   authentication,
    //   this.controller.getAllforAdmin
    // )

    this.router.get(
      '/',
      authentication,
      this.controller.getAll
    )

    this.router.get(
      '/:_id',
      authentication,
      this.controller.getById
    )

    this.router.put(
      '/like/:_id',
      authentication,
      validator(NftLikeSchema),
      this.controller.updateLike
    )

    this.router.put(
      '/:_id',
      authentication,
      // validator(NftLikeSchema),
      this.controller.update
    )

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
