import { Request, Response, NextFunction } from 'express'
import { PublicRequest, Pagination } from 'app-request'
import asyncHandler from '../helpers/asyncHandler';
import { Model } from 'mongoose'

export default function fetchUtils(model: Model<any>) {
  return asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    const { limit, page } = req.query as { page: string, limit: string };

    // pagination
    const total = await model.countDocuments();
    const crPage = parseInt(page, 10) || 1;
    const crLimit = parseInt(limit, 6) || total;
    const startIndex = (crPage - 1) * crLimit;
    const endIndex = crPage * crLimit;
    const pages = Math.ceil(total / crLimit)

    const pagination: Pagination = {
      total: 0,
      pages: 0,
    };
    pagination.total = total
    pagination.pages = pages

    if (endIndex < total) {
      pagination.next = {
        page: crPage + 1,
        limit: crLimit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: crPage - 1,
        limit: crLimit,
      };
    }

    req.pagination = pagination;
    req.skip_limit = { limit: crLimit, skip: crLimit * (crPage - 1) } as Pagination['skip_limit']

    next()
  })
}
