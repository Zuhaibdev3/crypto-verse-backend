import express from 'express';
import { ProtectedRequest } from 'app-request';
import { AuthFailureError } from '../core/ApiError';
import RoleRepo from '../database/repository/RoleRepo';
import asyncHandler from '../helpers/asyncHandler';
import Role, { RoleCode } from '../database/model/Role';

export default function authorization(allow_roles: Role['code'][]) {
  return asyncHandler(async (req: any, res, next) => {
    // if (!req.user || !req.user.roleId)
    if (!req.user) throw new AuthFailureError('Permission denied');
    // have to remove 'req?.user?.role?.code'  as its is on old structure
    const role = await RoleRepo.findByCode(req?.user?.role?.code || req.user?.roleId?.code);

    if (!role) throw new AuthFailureError("You don't have access to this action");

    if(allow_roles.includes(RoleCode.USER) && role?.code !== RoleCode.ADMIN && role?.code !== RoleCode.SUPER_ADMIN ){

      return next()

    }else if (!allow_roles.includes(role?.code)) {

      throw new AuthFailureError("un-authorized");
      
    }


    return next()

  })
}
