import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const appRoutes: Routes = [
        { path: '**', component: AppComponent }
];

export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: false } );
