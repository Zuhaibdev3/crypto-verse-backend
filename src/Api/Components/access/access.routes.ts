import { Router } from 'express';
import { AccessController } from './access.controller';
import validator from '../../../validations/validator';
import authentication from '../../../middleware/authentication';
import { ForgotPasswordValidationSchema, ResetPasswordValidationSchema, SigninValidationSchema, SignupValidationSchema, UpdateWalletDetailValidationSchema, VerifyOtpValidationSchema, WalletValidationSchema } from '../../../validations/payloadSchema/AccessSchema';

export class AccessRoutes {

  readonly router: Router = Router();
  readonly controller: AccessController = new AccessController()

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {

    this.router.post(
      '/connectedtowallet',
      validator(WalletValidationSchema),
      this.controller.connectedToWallet
    )

    this.router.post(
      '/signin',
      validator(SigninValidationSchema),
      this.controller.signin
    )

    this.router.post(
      '/signup',
      validator(SignupValidationSchema),
      this.controller.signup
    )

    this.router.delete(
      '/signout',
      authentication,
      this.controller.signout
    )

    this.router.post(
      '/forgot-password',
      validator(ForgotPasswordValidationSchema),
      this.controller.forgotPassword
    )

    this.router.post(
      '/verify-otp',
      validator(VerifyOtpValidationSchema),
      this.controller.verifyOtp
    )

    this.router.post(
      '/reset-password',
      validator(ResetPasswordValidationSchema),
      this.controller.resetPassword
    )

    this.router.post(
      '/verify',
      authentication,
      this.controller.verify
    )

    this.router.put(
      '/update-profile',
      authentication,
      // validator(UpdateWalletDetailValidationSchema),
      this.controller.updateProfle
    )

    this.router.get(
      '/users',
      authentication,
      this.controller.getUsers
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




    //   this.router.put(
    //     '/me',
    //     authentication,
    //     validator(schema.updateInfo),
    //     this.controller.updateMe
    //   )


  }

}
