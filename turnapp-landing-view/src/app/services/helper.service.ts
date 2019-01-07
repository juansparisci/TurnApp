import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  /**
   * Set value of nested object property by string. If property is null, will be created
   */
  public SetValueByPropertyString(propertyPath: string, value: any, object: any): any {
      const propertiesArray = propertyPath.split('.');
      let schema = object;
      propertiesArray.forEach((prop, index) => {
        schema[prop] = schema[prop] == null ? {} : schema[prop];
        if ( index === (propertiesArray.length - 1 )) {
          schema[prop] = value;
        }
        schema = schema[prop];
      });
  }
}
