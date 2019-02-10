import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

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
  public textEditModal( property: string, currVal: string, obj: any): Promise<boolean> {
    return swal({
      title: 'Ingrese el texto',
      input: 'text',
      inputValue: currVal,
      onOpen: function() {
        const input: any = swal.getInput();
        input.setSelectionRange(0, input.value.length);
      },
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: false,
      allowOutsideClick: () => !swal.isLoading(),
    }).then((result) => {
      if ( result.value ) {
         this.SetValueByPropertyString(property, result.value, obj);
         return true;
      } else { return false; }
    });
  }
}
