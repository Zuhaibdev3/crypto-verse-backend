import { NextFunction, Response, Request } from "express";
import { NoDataError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";
import asyncHandler from "../../../helpers/asyncHandler";
import UserRepo from '../../../database/repository/UserRepo';
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

  get = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      // const mentors = await UserRepo.updateInfo();
      console.log("get mentors response")
      // console.log(mentors)
      // if (mentors.length === 0) throw new NoDataError('no mentors available');
      new SuccessResponse('mentors fetched successfully', req).send(res)
    }
  )



}