export interface Garment {
  identificador: number;
  nombre: string;
  talla_prenda: string;  // Char(1) - solo S, M, L, X
  color: string;         // Varchar(15)
  precio_sugerido: number;
  stock: number;
  estado: string;        // Char(1) - A o I
  fecha_registro: string;
}