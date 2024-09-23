declare type Class<T = any> = new (...args: any[]) => T;

export class DataCopier {
    static copy<T extends {}>(target: Class<T>, source: any): T {
    let targetObject : {[char: string]: string} = new target();
    let response : {[char: string]: string} = targetObject as T;

    let keys = Object.keys(targetObject);

    if (keys[0] == '0') {
      response = {} as T;
    } else {
      for (let key of keys) {
        if (targetObject[key]) {
          if (targetObject[key].constructor === Array && !Array.isArray(source[key]) ) {
            // @ts-ignore
            response[key] = [];
            if (source[key] != undefined ) {
              for (let item of source[key]) {
                let data: any = { ...{}, ...item };
                // @ts-ignore
                response[key].push(data);
              }
            }
          } else if (typeof targetObject[key] === 'object') {
            response[key] = source[key];
          } else {
            if (source[key] != undefined) {
              response[key] = source[key];
            }
          }
        } else {
          if (source[key] != undefined) {
            response[key] = source[key];
          }
        }
      }
    }
    // @ts-ignore
    return response;
  }

  static convertToObject(entity: any): any {
    let object: any = {};

    let keys = Object.keys(entity);
    if (keys[0] == '0') {
      object = entity;
    } else {
      for (let key of keys) {
        if (entity[key]) {
          if (entity[key].constructor === Array) {
            object[key] = [];
            for (let item of entity[key]) {
              object[key].push(this.convertToObject(item));
            }
          } else if (typeof entity[key] === 'object') {
            object[key] = this.convertToObject(entity[key]);
          } else {
            object[key] = entity[key];
          }
        } else {
          object[key] = entity[key];
        }
      }
    }
    return object;
  }

  static assignToTarget<T, Y>(target: T, source: Y) {
    const a = { ...target, ...source };
    return a;
  }
  
  static copyMultipleFromSourceArrayProperty<T extends {}>(target: Class<T>, source: object, sourcePropertyName : string  ) {

    let data = this.prepareDataFromSourceArrayProperty(source , sourcePropertyName )
    let copiedData = this.copyArrayOfObjects(target, data)
    return copiedData

  }

  static prepareDataFromSourceArrayProperty<T, Y>(source: Y, sourcePropertyName : string  ) {

    // @ts-ignore
   return source[sourcePropertyName].map((sourceArrayProperty)=>{
    return {...source, [sourcePropertyName] : sourceArrayProperty }
   })
  }

  static copyArrayOfObjects<T extends {}>(target: Class<T>, source: any[]): T[] {
    return source.map((sourceObject)=>{
    return this.copy(target, sourceObject)
   })
  }

  static assignAndCopyArray< T , Z>(source : any[], userData : any , Class : any): any {
    let result = []
    for(let element of source) {
       let sourceData = this.assignToTarget(element , userData)
       let addSourceData = this.copy(Class , sourceData)
       result.push(addSourceData)
    }
    return result

  }
  

}
