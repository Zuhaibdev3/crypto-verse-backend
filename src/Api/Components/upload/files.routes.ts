import { Router } from 'express';
import { FileController } from "./files.controller"
import authentication from '../../../middleware/authentication';

export class FileRoutes {

    readonly router: Router = Router();
    readonly controller: FileController = new FileController()

    constructor() {
        this.initRoutes();
    }

    initRoutes(): void {

        this.router.post(
            '/image',
            authentication,
            this.controller.uploadOnCloudinary
        )
    }

}
