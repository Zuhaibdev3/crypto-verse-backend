import { NextFunction, Response, Request } from "express";
import { NoDataError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";
import asyncHandler from "../../../helpers/asyncHandler";
//import User from '../../../database/model/User';
import UserRepo from '../../../database/repository/UserRepo';
import { SearchPayloadDTO } from "../../../Interface/payloadInterface";
import { searchFieldNames } from "../search/entities";
import { search } from "../search/search";
import { BadRequestError } from "../../../core/ApiError";
import { resolve } from "../../../dependencymanagement"
import { IUserService } from "./iuser.service";
import SERVICE_IDENTIFIER from "../../../identifiers";
export class userController {

  getUserService(): IUserService {
    return resolve<IUserService>(SERVICE_IDENTIFIER.UserService);
  }

  userService = this.getUserService();

  update = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

      // @ts-ignore
      const result = await UserRepo.updateInfo(req.params.id, req.body);

      // if (mentors.length === 0) throw new NoDataError('no mentors available');
      new SuccessResponse('mentors fetched successfully', result).send(res)
    }
  )

  updateProfilePic = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      // @ts-ignore
      const result = await UserRepo.updateProfilePicByEmail(req.body.email, req.body);

      // if (mentors.length === 0) throw new NoDataError('no mentors available');
      new SuccessResponse('Profile pic updated successfully', result).send(res)
    }
  )

  get = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      // const mentors = await UserRepo.updateInfo();
      console.log("get mentors response")
      // console.log(mentors)
      // if (mentors.length === 0) throw new NoDataError('no mentors available');
      new SuccessResponse('mentors fetched successfully', req).send(res)
    }
  )

  searchController = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      let result: SearchPayloadDTO = req.body
      let SearchData = await search(searchFieldNames.User, result.query, result.query_by, {}, `${result.filtered_by}`)

      new SuccessResponse('fetched successfully', SearchData).send(res);
    }
  )

  addFcmToken = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      if (!await req.user.fcm_token.includes(req.body.fcm_token)) {
        await UserRepo.addFcmToken({ ...req.user, fcm_token: [...req?.user?.fcm_token, req.body.fcm_token] })
      }
      new SuccessResponse('fetched successfully', { fcm_token: req.body.fcm_token }).send(res);
    }
  )

  getUsersRecommendations = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      let userData = req.user
      const result = await UserRepo.getUsersRecommendations(userData)
      new SuccessResponse('fetched successfully', result).send(res);
    }
  )
  getBusinessScoreCardData = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      let { businessId } = req.user
      const result = await this.userService.getBusinessScoreCardData(businessId)
      new SuccessResponse('fetched successfully', result).send(res);
    }
  )
  updateSkills = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

      const result = await UserRepo.updateSkills(req.user._id, req.body)
      new SuccessResponse('fetched successfully', result).send(res);
    }
  )
  updateExperience = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const result = await UserRepo.updateLifeExperience(req.user._id, req.body)
      new SuccessResponse('fetched successfully', result).send(res);
    }
  )
  updateCulture = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const result = await UserRepo.updateCultureGoup(req.user._id, req.body)
      new SuccessResponse('fetched successfully', result).send(res);
    }
  )

  updateBio = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const result = await UserRepo.updateBio(req.user._id, req.body)
      new SuccessResponse('fetched successfully', result).send(res);
    }
  )
  updateMentorShip = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const result = await UserRepo.updateMentorshipStatus(req.user._id, req.body)
      new SuccessResponse('fetched successfully', result).send(res);
    }
  )

  getFollowing = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const result = await UserRepo.getFollowing(req.user)
      new SuccessResponse('fetched successfully', result).send(res);
    }
  )
  updateProfileView = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      if (req.params.id == req.user._id) throw new BadRequestError('Cant Increase YOur View Count');
      const result = await UserRepo.updateProfileView(req.params.id)
      new SuccessResponse('fetched successfully', result).send(res);
    }
  )
  getUserWithSurveyPermission = asyncHandler(
    async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
      const { page = 1, limit = 10, searchQuery = '' } = req.query
      const result = await UserRepo.getUsersWithSurveyPermission(req.user, page, limit, searchQuery)
      new SuccessResponse('User fetched successfully', result).send(res);
    }
  )
}