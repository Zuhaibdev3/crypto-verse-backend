import mongoose, { Schema } from "mongoose";

import { USER_COLLECTION_NAME, USER_DOCUMENT_NAME } from "../Components/user/user.entity";

export const BaseSuperAdminModel = new mongoose.Schema({

  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: USER_DOCUMENT_NAME , required: true},

  updatedBy: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME , required: true},

  isDeleted: { type: Schema.Types.Boolean,  default : false },

}, { _id: false, timestamps : true , versionKey : false }); // Don't generate separate _id fields for documents using this schema

export const BaseModel = new mongoose.Schema({

  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: USER_DOCUMENT_NAME , required: true},

  userId: { type: mongoose.Schema.Types.ObjectId, ref: USER_DOCUMENT_NAME , required: true},

  updatedBy: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME , required: true},

  isDeleted: { type: Schema.Types.Boolean,  default : false },

}, { _id: false, timestamps : true , versionKey : false }); // Don't generate separate _id fields for documents using this schema

