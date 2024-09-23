import { Request } from "express";

declare type Class<T = any> = new (...args: any[]) => T;

export class requestParser {
  

  static getQueryFilters<T extends Record<string, any>>(
    req: Request,
    // queryClass: new () => T
    queryClass: Class<T>
  ): T {
    try {
      const instance = new queryClass();

      for (const key of Object.keys(instance)) {
        if (key in req.query) {
          (instance as any)[key] = req.query[key] as any;
        }else {
          // If the key doesn't exist in req.query, delete it from the instance
          delete (instance as any)[key];
        }
      }

      return instance;
    } catch (error) {
      throw error;
    }
  }
}

