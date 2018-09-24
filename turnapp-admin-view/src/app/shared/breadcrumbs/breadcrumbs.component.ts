import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {
  label: string = '';
  constructor(private router: Router,
              public title: Title,
              public meta: Meta) {
      this.getDataRoute().subscribe( data => {
        this.label = data.titulo;
        this.title.setTitle(data.titulo);
        const metaTag: MetaDefinition = {
          name: 'description',
          content: this.label
        };
        this.meta.updateTag(metaTag);
      });
   }

  ngOnInit() {
  }
  getDataRoute() {
    return this.router.events.pipe(
    filter( evento => {
      return evento instanceof ActivationEnd;
    }),
    filter( (evento: ActivationEnd) => {
      return evento.snapshot.firstChild === null;
    }),
    map( (evento: ActivationEnd) => {
      return evento.snapshot.data;
    }));
  }
}
