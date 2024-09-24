import { Router } from 'express';
import { AccessController } from './access.controller';
import validator, { ValidationSource } from '../../../validations/validator';
import { signupSchema, userCredential, refreshToken, otpCredential, resendOtpCredential, updateMfaCredential } from "../../../utils/joi.schema"
import schema from './schema'
import authentication from '../../../middleware/authentication';

export class AccessRoutes {

  readonly router: Router = Router();
  readonly controller: AccessController = new AccessController()

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {

    this.router.post(
      '/signup',
      // validator(signupSchema),
      this.controller.signup
    )

    this.router.post(
      '/signin',
      validator(userCredential),
      this.controller.signin
    )

    //   this.router.post(
    //     '/resend-otp',
    //     validator(resendOtpCredential),
    //     this.controller.resendOtp
    //   )
    //   this.router.put(
    //     '/update-mfa',
    //     authentication,
    //     validator(updateMfaCredential),
    //     this.controller.updateUserMfa
    //   )

    //   this.router.delete(
    //     '/signout',
    //     authentication,
    //     this.controller.signout
    //   )

      this.router.post(
        '/verify',
        authentication,
        this.controller.verify
      )

    //   this.router.post(
    //     '/refresh',
    //     authentication,
    //     validator(refreshToken),
    //     this.controller.refresh
    //   )

    //   this.router.get(
    //     '/user',
    //     this.controller.getUser
    //   )

    //   this.router.get(
    //     '/users',
    //     authentication,
    //     this.controller.getUsers
    //   )

    //   this.router.delete(
    //     '/users/:_id',
    //     authentication,
    //     this.controller.deleteUser
    //   )

    //   this.router.put(
    //     '/me',
    //     authentication,
    //     validator(schema.updateInfo),
    //     this.controller.updateMe
    //   )


    //   this.router.post(
    //     '/createuser',
    //     authentication,
    //     validator(schema.createUser),
    //     this.controller.createUser
    //   )

    //   this.router.get(
    //     '/instructor',
    //     authentication,
    //     this.controller.createdByExist
    //   )

    //   this.router.get(
    //     '/users/name',
    //     authentication,
    //     // validator(GetSameBusinessUsersByNameDropdownQueryValidationSchema),
    //     this.controller.getSameBusinessUsersByNameDropdown
    //   )

  }

}
