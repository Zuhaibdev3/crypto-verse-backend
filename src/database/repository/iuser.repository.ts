import IRepository from "../../repository/irepository";
import Keystore from "../model/Keystore";
import { Types } from 'mongoose';
import Role from '../model/Role';
import { DatabaseId } from "../../../types";
import { User } from "../../Api/Components/user/user.entity";
import { UpdateWalletDetailPayloadDTO } from "../../Interface/payloadInterface";

export default interface IUserRepo {
  create(arg0: any, accessTokenKey: any, refreshTokenKey: any, role: any): Promise<any>;
  findUsers(): Promise<User[]>
  find(role: Role, query: any): Promise<User[]>
  findById(id: Types.ObjectId): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByWalletAddress(walletAddress: string): Promise<User | null>
  updateInfo(_id: string, user: User | UpdateWalletDetailPayloadDTO): Promise<User | UpdateWalletDetailPayloadDTO | null>
  createUser(user: User, roleCode: string): Promise<{ user: User }>
  update(user: User, accessTokenKey: string, refreshTokenKey: string): Promise<{ user: User; keystore: Keystore }>
  delete(id: Types.ObjectId): Promise<User | null>
}