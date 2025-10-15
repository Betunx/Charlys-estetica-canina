import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Fundadora {
  nombre: string;
  rol: string;
  descripcion: string;
  foto: string;
  certificado?: string;
}

@Component({
  selector: 'app-nosotros',
  imports: [CommonModule, RouterLink],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.scss'
})
export class Nosotros {
  protected fotoLocal = 'assets/images/local-charlys.jpg'; // Placeholder - reemplazar con foto real

  protected historia = {
    titulo: 'Nuestra Historia',
    descripcion: `Charly's Estética Canina nació del amor profundo por los animales y el compromiso de brindar
    el mejor cuidado para cada mascota. Nos especializamos en ofrecer servicios de calidad con un toque
    personalizado, donde cada perrito es tratado con el cariño y respeto que se merece.

    Nuestro objetivo es crear un espacio donde tu mascota se sienta cómoda, segura y amada mientras recibe
    los mejores cuidados estéticos. Creemos que cada mascota es única y merece atención especializada que
    resalte su belleza natural y personalidad.`
  };

  protected fundadoras: Fundadora[] = [
    {
      nombre: 'Karla',
      rol: 'Estilista Canina Certificada',
      descripcion: `Karla es una estilista canina certificada con un profundo amor por los animales.
      Su dedicación y pasión por el cuidado de las mascotas la llevaron a especializarse en estética canina,
      donde combina técnica profesional con un trato amoroso hacia cada perrito que atiende.

      Su sueño siempre fue crear un espacio donde los dueños pudieran confiar plenamente en el cuidado de
      sus compañeros peludos, y así nació Charly's Estética Canina.`,
      foto: 'assets/images/karla.jpg', // Placeholder - reemplazar con foto real
      certificado: 'assets/images/certificado-karla.jpg' // Placeholder - reemplazar con certificado real
    },
    {
      nombre: 'Mikeila',
      rol: 'Pastora Australiana Ovejera - Inspiración y Copropietaria',
      descripcion: `Mikeila, una hermosa pastora australiana ovejera, es mucho más que una mascota:
      es la inspiración detrás de Charly's Estética Canina. Su llegada a la vida de Karla marcó un
      punto de inflexión que la motivó a dedicarse profesionalmente al cuidado y embellecimiento de
      los mejores amigos del ser humano.

      Mikeila es la embajadora oficial del negocio y nos recuerda cada día por qué hacemos lo que hacemos:
      por amor incondicional a los animales.`,
      foto: 'assets/images/mikeila.jpg' // Placeholder - reemplazar con foto real
    }
  ];

  protected valores = [
    {
      icono: '❤️',
      titulo: 'Amor por los Animales',
      descripcion: 'Cada mascota es tratada con el cariño y respeto que merece'
    },
    {
      icono: '✨',
      titulo: 'Calidad Profesional',
      descripcion: 'Servicios certificados con los mejores estándares de la industria'
    },
    {
      icono: '🏠',
      titulo: 'Ambiente Familiar',
      descripcion: 'Un espacio seguro y cómodo donde tu mascota se siente como en casa'
    },
    {
      icono: '🎓',
      titulo: 'Capacitación Continua',
      descripcion: 'Siempre actualizados con las últimas técnicas y tendencias'
    }
  ];

  verCertificado(url: string): void {
    window.open(url, '_blank');
  }
}
