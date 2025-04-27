import { Routes } from '@angular/router';
import { JuegoComponent } from './juego/juego.component';
import { AjedrezComponent } from './ajedrez/ajedrez.component';

export const routes: Routes = [
    { path: '', component: JuegoComponent },
    { path: 'ajedrez', component: AjedrezComponent },
];

