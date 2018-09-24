import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {
  @ViewChild('txtProgress') txtProgress: ElementRef;
  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;
  @Output() cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() {
   }

  ngOnInit() {
  }
  onChange( newValue: number ) {
    if (newValue >= 100) {
      this.progreso = 100;
    } else if (newValue <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }
    this.txtProgress.nativeElement.value = this.progreso;
    this.cambioValor.emit(this.progreso);
  }
  cambiarValor(val: number) {
    this.progreso = parseFloat(this.progreso.toString());
    const aux: number = this.progreso + val;
    if (aux > 100) {
      this.progreso = 100;
      return;
    }
    if (aux < 0) {
      this.progreso = 0;
      return;
    }
    this.progreso = this.progreso + val;
    this.cambioValor.emit(this.progreso);
    this.txtProgress.nativeElement.focus();
}
}
