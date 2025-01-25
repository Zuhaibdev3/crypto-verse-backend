import Role, { RoleCode, RoleModel } from '../../../database/model/Role';

export default class RoleRepo {

  public static async create(req: any , res : any) {    
    console.log("haris")
    const roles = await RoleModel.insertMany([
          // @ts-ignore    
          { code: RoleCode.USER },
          // @ts-ignore    
          { code: RoleCode.SUPER_ADMIN },
        ]); //  as Role
    // return { roles };
    res.send({roles})
  }

}
