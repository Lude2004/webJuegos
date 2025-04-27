import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Juego {
  id: number;
  titulo: string;
  desarrollador: string;
  fechaLanzamiento: string;
  genero: string;
  plataformas: string[];
  puntuacion: number;
  puntuaciones: {
    jugabilidad: number;
    historia: number;
    graficos: number;
    sonido: number;
  };
  imagen: string;
  descripcion: string;
}

interface Articulo {
  id: number;
  titulo: string;
  categoria: string;
  autor: {
    nombre: string;
    avatar: string;
  };
  fecha: string;
  imagen: string;
  descripcion: string;
  icono: string;
  colorCategoria: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GameZone - Blog de Videojuegos';
  
  // Variables para las animaciones
  focus: boolean = false;
  focus1: boolean = false;
  page: number = 1;
  page2: number = 1;
  fecha = new Date();
  model = {year: this.fecha.getFullYear(), month: this.fecha.getMonth() + 1, day: this.fecha.getDate()};
  
  // Datos para las reseñas de videojuegos
  juegosDestacados: Juego[] = [
    {
      id: 1,
      titulo: 'Elden Ring 2',
      desarrollador: 'FromSoftware',
      fechaLanzamiento: '15 de abril, 2025',
      genero: 'RPG de Acción',
      plataformas: ['PC', 'PlayStation 5', 'Xbox Series X'],
      puntuacion: 9.5,
      puntuaciones: {
        jugabilidad: 95,
        historia: 90,
        graficos: 92,
        sonido: 96
      },
      imagen: 'assets/img/review-game1.jpg',
      descripcion: 'Este esperado título mantiene la esencia de la saga mientras introduce un mundo abierto aún más vasto y mecánicas refinadas que llevan la experiencia a otro nivel...'
    },
    {
      id: 2,
      titulo: 'Starfield: Expanded Universe',
      desarrollador: 'Bethesda',
      fechaLanzamiento: '8 de marzo, 2025',
      genero: 'RPG Espacial',
      plataformas: ['PC', 'Xbox Series X'],
      puntuacion: 8.7,
      puntuaciones: {
        jugabilidad: 85,
        historia: 92,
        graficos: 88,
        sonido: 90
      },
      imagen: 'assets/img/review-game2.jpg',
      descripcion: 'La expansión del universo de Starfield ofrece nuevos planetas por explorar y una narrativa más profunda que complementa perfectamente el juego base...'
    }
  ];
  
  // Datos para los artículos del blog
  articulos: Articulo[] = [
    {
      id: 1,
      titulo: 'El nuevo AAA que revolucionará la industria',
      categoria: 'Lanzamiento',
      autor: {
        nombre: 'Mario García',
        avatar: 'assets/img/avatar-gamer.jpg'
      },
      fecha: '25 de abril, 2025',
      imagen: 'assets/img/game-article1.jpg',
      descripcion: 'Analizamos en profundidad el esperado lanzamiento que promete redefinir los juegos de acción...',
      icono: 'fas fa-fire',
      colorCategoria: 'text-danger'
    },
    {
      id: 2,
      titulo: 'Review: El último indie que está cautivando a todos',
      categoria: 'Análisis',
      autor: {
        nombre: 'Elena Rodríguez',
        avatar: 'assets/img/avatar-gamer2.jpg'
      },
      fecha: '22 de abril, 2025',
      imagen: 'assets/img/game-article2.jpg',
      descripcion: 'Este título independiente está sorprendiendo por su innovador sistema de juego y una narrativa única...',
      icono: 'fas fa-gamepad',
      colorCategoria: 'text-info'
    },
    {
      id: 3,
      titulo: 'El equipo español triunfa en el mundial de League of Legends',
      categoria: 'E-Sports',
      autor: {
        nombre: 'Carlos Martínez',
        avatar: 'assets/img/avatar-gamer3.jpg'
      },
      fecha: '20 de abril, 2025',
      imagen: 'assets/img/game-article3.jpg',
      descripcion: 'Contra todo pronóstico, el equipo español ha conseguido alzarse con el trofeo mundial...',
      icono: 'fas fa-trophy',
      colorCategoria: 'text-success'
    }
  ];
  
  constructor() { }
  
  // Método para convertir a estrellas una puntuación sobre 10
  obtenerEstrellas(puntuacion: number): number[] {
    const estrellas = Math.round(puntuacion / 2);
    return Array(estrellas).fill(0);
  }
  
  // Método para ordenar los artículos por fecha
  obtenerArticulosRecientes(): Articulo[] {
    return [...this.articulos].sort((a, b) => {
      const fechaA = new Date(this.convertirFecha(a.fecha));
      const fechaB = new Date(this.convertirFecha(b.fecha));
      return fechaB.getTime() - fechaA.getTime();
    });
  }
  
  // Método para convertir formato de fecha
  private convertirFecha(fecha: string): string {
    const partes = fecha.split(' de ');
    const meses: {[key: string]: string} = {
      'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
      'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
      'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
    };
    return `${partes[2]}-${meses[partes[1].toLowerCase()]}-${partes[0].padStart(2, '0')}`;
  }
}
