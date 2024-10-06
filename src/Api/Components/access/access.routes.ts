import { Router } from 'express';
import { AccessController } from './access.controller';
import validator from '../../../validations/validator';
import authentication from '../../../middleware/authentication';
import { UpdateWalletDetailValidationSchema, WalletValidationSchema } from '../../../validations/payloadSchema/AccessSchema';

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

    this.router.delete(
      '/signout',
      authentication,
      this.controller.signout
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



    //   this.router.put(
    //     '/me',
    //     authentication,
    //     validator(schema.updateInfo),
    //     this.controller.updateMe
    //   )


  }

}
