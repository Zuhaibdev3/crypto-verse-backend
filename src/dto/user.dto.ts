import IUser from "../Api/Components/user/user.entity"

export interface IUsersInHierarchyDTO {
  executive: IUser[]
  vice_president: IUser[]
  director: IUser[]
  manager: IUser[]
  senior_level: IUser[]
  mid_level: IUser[]
  entry_level: IUser[]
}