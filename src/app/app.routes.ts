import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Servicios } from './components/servicios/servicios';
import { Galeria } from './components/galeria/galeria';
import { Contacto } from './components/contacto/contacto';
import { Citas } from './components/citas/citas';
import { Nosotros } from './components/nosotros/nosotros';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'nosotros', component: Nosotros },
  { path: 'servicios', component: Servicios },
  { path: 'galeria', component: Galeria },
  { path: 'citas', component: Citas },
  { path: 'contacto', component: Contacto },
  { path: '**', redirectTo: '' }
];
