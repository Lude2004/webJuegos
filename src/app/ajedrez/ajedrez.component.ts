import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as Chess from 'chess.js';

@Component({
  selector: 'app-ajedrez',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajedrez.component.html',
  styleUrls: ['./ajedrez.component.css']
})
export class AjedrezComponent implements OnInit, AfterViewInit {
  @ViewChild('tablero', { static: false }) tableroElement!: ElementRef;
  
  // Propiedades del juego
  chess: any;
  selectedPiece: any = null;
  posiblesMovimientos: string[] = [];
  boardSize = 400;
  cellSize = 50;
  piezas: { [key: string]: string } = {
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
    'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔'
  };
  historialMovimientos: string[] = [];
  turnoActual: string = 'blancas';
  juegoTerminado: boolean = false;
  resultadoJuego: string = '';
  
  constructor() {
    this.chess = new Chess.Chess();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dibujarTablero();
  }

  dibujarTablero(): void {
    const canvas = this.tableroElement.nativeElement;
    const ctx = canvas.getContext('2d');
    
    // Configurar tamaño del canvas
    canvas.width = this.boardSize;
    canvas.height = this.boardSize;
    this.cellSize = this.boardSize / 8;
    
    // Dibujar el tablero
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        // Alternar colores para las casillas
        const color = (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863';
        ctx.fillStyle = color;
        ctx.fillRect(col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
        
        // Dibujar coordenadas en los bordes
        if (col === 0) {
          ctx.fillStyle = (row % 2 === 0) ? '#b58863' : '#f0d9b5';
          ctx.font = '16px Arial';
          ctx.fillText(8 - row + '', 5, row * this.cellSize + 20);
        }
        
        if (row === 7) {
          ctx.fillStyle = (col % 2 === 1) ? '#b58863' : '#f0d9b5';
          ctx.font = '16px Arial';
          ctx.fillText(String.fromCharCode(97 + col), col * this.cellSize + this.cellSize - 15, 8 * this.cellSize - 5);
        }
        
        // Obtener la pieza en esta posición
        const position = String.fromCharCode(97 + col) + (8 - row);
        const piece = this.chess.get(position);
        
        if (piece) {
          // Dibujar la pieza
          ctx.fillStyle = piece.color === 'w' ? '#ffffff' : '#000000';
          ctx.font = `${this.cellSize * 0.8}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            this.piezas[piece.type.toUpperCase() + (piece.color === 'b' ? '' : '')], 
            col * this.cellSize + this.cellSize / 2, 
            row * this.cellSize + this.cellSize / 2
          );
        }
      }
    }
    
    // Destacar movimientos posibles
    if (this.posiblesMovimientos.length > 0) {
      for (const move of this.posiblesMovimientos) {
        const col = move.charCodeAt(0) - 97;
        const row = 8 - parseInt(move[1]);
        
        ctx.beginPath();
        ctx.arc(
          col * this.cellSize + this.cellSize / 2,
          row * this.cellSize + this.cellSize / 2,
          this.cellSize / 6,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.fill();
      }
    }
  }

  handleClick(event: MouseEvent): void {
    if (this.juegoTerminado) return;
    
    const canvas = this.tableroElement.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    
    const square = String.fromCharCode(97 + col) + (8 - row);
    const piece = this.chess.get(square);
    
    if (this.selectedPiece) {
      // Si ya hay una pieza seleccionada, intentar mover
      if (this.posiblesMovimientos.includes(square)) {
        const movimiento = {
          from: this.selectedPiece.square,
          to: square,
          promotion: 'q' // promoción automática a reina
        };
        
        const movimientoRealizado = this.chess.move(movimiento);
        
        if (movimientoRealizado) {
          this.historialMovimientos.push(
            `${this.turnoActual}: ${movimientoRealizado.san}`
          );
          
          this.turnoActual = this.chess.turn() === 'w' ? 'blancas' : 'negras';
          this.verificarEstadoJuego();
        }
      }
      
      // Limpiar selección y redibujar
      this.selectedPiece = null;
      this.posiblesMovimientos = [];
      this.dibujarTablero();
    } else if (piece && ((piece.color === 'w' && this.chess.turn() === 'w') || 
                         (piece.color === 'b' && this.chess.turn() === 'b'))) {
      // Seleccionar una pieza y mostrar movimientos posibles
      this.selectedPiece = { type: piece.type, color: piece.color, square };
      this.posiblesMovimientos = [];
      
      // Obtener movimientos legales
      const moves = this.chess.moves({ square, verbose: true });
      for (const move of moves) {
        this.posiblesMovimientos.push(move.to);
      }
      
      this.dibujarTablero();
    }
  }

  verificarEstadoJuego(): void {
    if (this.chess.isCheckmate()) {
      this.juegoTerminado = true;
      const ganador = this.chess.turn() === 'w' ? 'Negras' : 'Blancas';
      this.resultadoJuego = `¡Jaque mate! ${ganador} ganan`;
    } else if (this.chess.isDraw()) {
      this.juegoTerminado = true;
      if (this.chess.isStalemate()) {
        this.resultadoJuego = 'Tablas por ahogado';
      } else if (this.chess.isThreefoldRepetition()) {
        this.resultadoJuego = 'Tablas por repetición';
      } else if (this.chess.isInsufficientMaterial()) {
        this.resultadoJuego = 'Tablas por material insuficiente';
      } else {
        this.resultadoJuego = 'Tablas';
      }
    } else if (this.chess.isCheck()) {
      this.resultadoJuego = `¡Jaque al rey ${this.turnoActual === 'blancas' ? 'blanco' : 'negro'}!`;
    } else {
      this.resultadoJuego = '';
    }
    
    this.dibujarTablero();
  }

  reiniciarJuego(): void {
    this.chess.reset();
    this.selectedPiece = null;
    this.posiblesMovimientos = [];
    this.historialMovimientos = [];
    this.turnoActual = 'blancas';
    this.juegoTerminado = false;
    this.resultadoJuego = '';
    this.dibujarTablero();
  }

  deshacer(): void {
    if (this.historialMovimientos.length > 0) {
      this.chess.undo();
      this.historialMovimientos.pop();
      this.turnoActual = this.chess.turn() === 'w' ? 'blancas' : 'negras';
      this.juegoTerminado = false;
      this.resultadoJuego = '';
      this.selectedPiece = null;
      this.posiblesMovimientos = [];
      this.dibujarTablero();
    }
  }
}