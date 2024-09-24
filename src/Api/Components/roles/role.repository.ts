import Role, { RoleModel } from '../../../database/model/Role';

export default class RoleRepo {

  public static async create(body: Role[]): Promise<{ roles: Role[] }> {    
    const roles = await RoleModel.insertMany(body); //  as Role
    return { roles };
  }

}
