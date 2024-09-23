

export interface IDataManipulationService {
  generateRandomString(length?: number , algorithm?: string ) : string
  generateRandomNumbers(length:number) : number
  hashString(string: string): Promise<string> 
  generateUniqueId(): string
}
