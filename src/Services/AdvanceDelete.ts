import asyncHandler from "../helpers/async";
import ErrorResponse from "../utils/ErrorResponse";
import { Request, NextFunction } from "express";
import { AdvanceResponse as Response } from "../Interface";
import { Model } from "mongoose";


const AdvancedDelete = (model: Model<any>) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const query = req.query
    const errors: Array<string> = []
    // console.log(query)
    // console.log(req.query)
    // console.log(model)
    // if (!query) return next(new ErrorResponse(400, 'Add delete query'))
    if (Object.keys(query).length === 0) return next(new ErrorResponse(400, 'Add delete query'))

    try {

        const deleted = await model.findOneAndDelete({ ...query })
        // console.log(deleted)
        if (!deleted) {
            return next(new ErrorResponse(404, "Delete Item Not Found"))
        }

        res.advanceDelete = {
            success: true,
            deleted,
        }

    } catch (error: any) {
        if (error.kind === "ObjectId") {
            errors.push(`Invalid ObjectId`)
            errors.push(`${error.reason}`)
            return next(new ErrorResponse(404, "Delete Item Not Found", errors))
        } else return next(new ErrorResponse(500, "Delete Field!"))
    }

    next();
}

export default AdvancedDelete;
