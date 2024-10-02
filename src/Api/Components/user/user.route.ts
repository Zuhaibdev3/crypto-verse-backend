import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate } from "passport";
import authentication from "../../../middleware/authentication";
import validator from "../../../validations/validator";

export class UserRoutes {
  readonly router: Router = Router();
  readonly controller: userController = new userController()

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void { }
}
