import { injectable } from 'inversify';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { IDataManipulationService } from '../interfaces/idataManipulation.service';
import { v4 as uuid4 } from 'uuid';

@injectable()
export class DataManipulationService implements IDataManipulationService {

  constructor() { }

  generateRandomString(length: number = 64, algorithm: 'hex' = 'hex'): string {
    const a = crypto.randomBytes(length).toString(algorithm)
    return a
  }
  generateRandomNumbers(length: number): number {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  hashString(string: string): Promise<string> {
    return bcrypt.hash(string, 10);
  }
 
  generateUniqueId(): string {
    return uuid4();
  }


}