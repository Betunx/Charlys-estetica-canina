import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  protected currentYear = new Date().getFullYear();

  protected contacto = {
    direccion: "Avenida José María Mendoza & Palo Verde, Sonacer",
    ciudad: "83174 Hermosillo, Son.",
    telefono: "+52 662 194 9884",
    whatsapp: "5216621949884",
    email: "info@charlysmascotas.com",
    horario: "Lun-Sáb: 9:00 AM - 5:00 PM"
  };

  protected redesSociales = [
    { nombre: 'Facebook', icono: '📘', url: 'https://www.facebook.com/p/Charlys-estetica-canina-100092578503226/' },
    { nombre: 'Instagram', icono: '📷', url: 'https://www.instagram.com/charlysesteticacanina/' },
    { nombre: 'TikTok', icono: '🎵', url: 'https://www.tiktok.com/@charlys_esteticacanina' },
    { nombre: 'WhatsApp', icono: '💬', url: `https://wa.me/${this.contacto.whatsapp}` }
  ];
}
