import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate } from "passport";
import authentication from "../../../middleware/authentication";
import validator from "../../../validations/validator";
import { SearchValidationSchema } from "../../../validations/payloadSchema/SearchSchema";

export class UserRoutes {
  readonly router: Router = Router();
  readonly controller: userController = new userController()

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {

    this.router.get(
      '/',
      this.controller.get
    )

    this.router.put(
      '/:id',
      this.controller.update
    )

    this.router.post(
      '/profile',
      this.controller.updateProfilePic
    )

    this.router.post(
      '/search',
      validator(SearchValidationSchema),
      authentication,
      this.controller.searchController
    )
    this.router.post(
      '/fcm',
      authentication,
      this.controller.addFcmToken
    )

    this.router.get(
      '/getuserrecommendation',
      authentication,
      this.controller.getUsersRecommendations
    )

    this.router.post(
      '/updateskills',
      authentication,
      this.controller.updateSkills
    )
    this.router.post(
      '/updateexperience',
      authentication,
      this.controller.updateExperience
    )
    this.router.post(
      '/updateculture',
      authentication,
      this.controller.updateCulture
    )
    this.router.post(
      '/updatebio',
      authentication,
      this.controller.updateBio
    )

    this.router.get(
      '/scorecard',
      authentication,
      this.controller.getBusinessScoreCardData
    )

    this.router.get(
      '/following',
      authentication,
      this.controller.getFollowing
    )
    this.router.get(
      '/increaseProfileCount/:id',
      authentication,
      this.controller.updateProfileView
    )
    this.router.get(
      '/getUserWithSurveyPermission',
      authentication,
      this.controller.getUserWithSurveyPermission
    )
  }
}
