import { Component, OnInit, OnDestroy } from '@angular/core';
import { retry, map, filter } from 'rxjs/operators';
import { Observable, Subscriber } from 'rxjs';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit {
  constructor() {
    const obs = this.regresaObservable();
    obs.pipe(
      retry(2)
    ).subscribe(numero => {
      console.log('Subs', numero);
    },
  error => console.log('Error', error),
  () => console.log('Obs termino')
  );
  // this.subscription = this.regresaObservable()
  // .subscribe(
  //   numero => console.log('Subs', numero),
  //   error => console.error('Error en obs', error),
  //   () => console.log('El observador termino')
  // );
   }

  ngOnInit() {
  }
 // ngOnDestroy() {
 //   this.subscription.unsubscribe();
 // }
  regresaObservable(): Observable<any> {

    return new Observable(observer => {
      let contador = 0;
      const intervalo = setInterval(() => {
        contador += 1;
        observer.next(contador);
        if (contador === 15) {
          clearInterval( intervalo );
          observer.complete();
        }
        if (contador === 13) {
          clearInterval( intervalo );
          observer.error('error en obs');
        }
      }, 1000);
    });
  }
}
