import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contacto',
  imports: [CommonModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss'
})
export class Contacto {
  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.infoContacto.mapsEmbed);
  }
  // Información del negocio
  protected infoContacto = {
    nombre: "Charly's Estética Canina",
    direccion: "Avenida José María Mendoza & Palo Verde, Sonacer",
    ciudad: "83174 Hermosillo, Son.",
    telefono: "+52 662 194 9884",
    whatsapp: "5216621949884",
    email: "info@charlysmascotas.com",
    horario: [
      { dias: "Lunes", horas: "9:00 AM - 5:00 PM" },
      { dias: "Martes", horas: "9:00 AM - 5:00 PM" },
      { dias: "Miércoles", horas: "9:00 AM - 5:00 PM" },
      { dias: "Jueves", horas: "9:00 AM - 5:00 PM" },
      { dias: "Viernes", horas: "9:00 AM - 5:00 PM" },
      { dias: "Sábado", horas: "9:00 AM - 5:00 PM" },
      { dias: "Domingo", horas: "Cerrado" }
    ],
    // Coordenadas para Google Maps
    lat: 29.10129117026882,
    lng: -111.00804943036906,
    // Link directo a Google Maps
    googleMapsUrl: "https://maps.app.goo.gl/CYpcXEBfWT9oczEY8",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d871.5371738424409!2d-111.00804943036906!3d29.10129117026882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86ce81448d69c33b%3A0xa93d09be96f4c3b3!2sCharly's%20est%C3%A9tica%20canina!5e0!3m2!1ses-419!2smx!4v1760556767327!5m2!1ses-419!2smx"
  };

  protected redesSociales = [
    { nombre: 'Facebook', icono: '📘', url: 'https://www.facebook.com/p/Charlys-estetica-canina-100092578503226/' },
    { nombre: 'Instagram', icono: '📷', url: 'https://www.instagram.com/charlysesteticacanina/' },
    { nombre: 'TikTok', icono: '🎵', url: 'https://www.tiktok.com/@charlys_esteticacanina' },
    { nombre: 'WhatsApp', icono: '💬', url: `https://wa.me/${this.infoContacto.whatsapp}` }
  ];

  abrirMaps(): void {
    window.open(this.infoContacto.googleMapsUrl, '_blank');
  }

  llamar(): void {
    window.location.href = `tel:${this.infoContacto.telefono}`;
  }

  enviarEmail(): void {
    window.location.href = `mailto:${this.infoContacto.email}`;
  }

  abrirWhatsApp(): void {
    const mensaje = encodeURIComponent("Hola, me gustaría agendar una cita para mi mascota");
    window.open(`https://wa.me/${this.infoContacto.whatsapp}?text=${mensaje}`, '_blank');
  }
}
