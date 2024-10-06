import { Router } from 'express';
// import validator, { ValidationSource } from '../../../helpers/validator';
// import schema from './schema';
import { FileController } from "./files.controller"
// import formidableMiddleware from "express-formidable"
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
            // validator(IndustryValidationSchema),
            this.controller.uploadOnCloudinary
        )
    }

}
