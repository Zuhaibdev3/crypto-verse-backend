import { Response } from "express";
import { Error } from "mongoose";
import jwt, { SignOptions } from 'jsonwebtoken'; // Import SignOptions from 'jsonwebtoken'


export interface AdvanceResponse extends Response {
    advanceFetch?: any
    advanceDelete?: any
}

export interface ValidationError extends Error {
    kind: string
    value: string
    path: string
}

export interface IJWTOtions extends SignOptions {
}

export interface IHunderedMSTokenPayload {

  roomId: string,
  userId: string,
  roleName: string,
  type?: string,

}
export enum NotificationTypes {

  "NORMAL"= "NORMAL",

}