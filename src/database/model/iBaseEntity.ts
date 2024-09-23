export interface IBaseEntity {
  _id:string;
  createdOnDate:number;
  Data?: {
      [key: string]: string;
  }
}
