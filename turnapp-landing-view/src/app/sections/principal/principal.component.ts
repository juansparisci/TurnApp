import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import swal from 'sweetalert2';
import { ClinicaService } from '../../services/service.index';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styles: []
})
export class PrincipalComponent implements OnInit {

  constructor(public helperService: HelperService,
              public _clinicaService: ClinicaService) { }

  ngOnInit() {
  }
  public textEditModal( property: string, currVal: string, obj: any) {
    this.helperService.textEditModal(property, currVal, this._clinicaService.clinica).then( r => {
      if ( r ) {
        this._clinicaService.hayCambios = true;
      }
    });
  }
  agregarItem() {
    swal.mixin({
      input: 'text',
      confirmButtonText: 'Siguiente &rarr;',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      progressSteps: ['1', '2']
    }).queue([
      {
        title: 'Titulo de item',
        text: 'Ingrese el titulo del item'
      },
      {title: 'Descripción de item',
      text: 'Ingrese la descripción del item'}
    ]).then((result) => {
      if (result.value) {
        if (!this._clinicaService.clinica.sitioInstitucional.principal.items) {
          this._clinicaService.clinica.sitioInstitucional.principal.items = [{
            tituloItem: result.value[0],
            descripcionItem: result.value[1]
    }];
        } else {
          this._clinicaService.clinica.sitioInstitucional.principal.items.push(
          {
             tituloItem: result.value[0],
            descripcionItem: result.value[1]
          }
        );
      }
      this._clinicaService.hayCambios = true;
    }
    });
  }
  quitarItem(index: number) {
    this._clinicaService.clinica.sitioInstitucional.principal.items.splice(index, 1);
    this._clinicaService.hayCambios = true;
  }
}
