import Logger from "../core/Logger"
import { environment, DATABASE } from "../config/globals"
import "../database"
import { RoleCode } from "../database/model/Role"
import RoleRepo from "../Api/Components/roles/role.repository"

(async function main(): Promise<void> {
  Logger.info(`seed runing on ${environment} mood, Database: ${DATABASE[environment]}`);
  try {

    // ====================================================
    const roles = await RoleRepo.create([
      // @ts-ignore    
      { code: RoleCode.USER },
      // @ts-ignore    
      { code: RoleCode.ADMIN },
      // @ts-ignore    
      { code: RoleCode.SUPER_ADMIN },
      // @ts-ignore    
      { code: RoleCode.INSTRUCTOR },
    ])
    Logger.info(roles);
    // ====================================================



  } catch (err: any) {
    console.log(err);
    // Logger.error(err);
  }
})();
