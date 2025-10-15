import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  protected caracteristicas = [
    { icono: '✂️', titulo: 'Profesionales', descripcion: 'Personal capacitado con años de experiencia' },
    { icono: '❤️', titulo: 'Con Amor', descripcion: 'Tratamos a tu mascota como familia' },
    { icono: '🏆', titulo: 'Calidad', descripcion: 'Productos premium para el cuidado de tu mascota' },
    { icono: '⚡', titulo: 'Rápido', descripcion: 'Servicio eficiente sin comprometer la calidad' }
  ];

  protected serviciosDestacados = [
    { icono: '🛁', titulo: 'Baño Completo', precio: '150', descripcion: 'Incluye shampoo, acondicionador y secado' },
    { icono: '✂️', titulo: 'Corte de Pelo', precio: '200', descripcion: 'Corte profesional según la raza' },
    { icono: '🐕', titulo: 'Paquete Completo', precio: '300', descripcion: 'Baño, corte y tratamiento especial' }
  ];
}
