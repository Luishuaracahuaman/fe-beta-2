// interfaces/garment.ts - CORREGIDO según tu BD
export interface Garment {
  identificador: number;    // ← Integer M PI
  nombre: string;           // ← Varchar(60) M  
  talla_prenda: string;     // ← Char(1) M (tallo_prenda en el diagrama)
  color: string;            // ← Varchar(15) M
  precio_sugerido: number;  // ← Money(7, 2) M (precio-sugerid en diagrama)
  stock: number;            // ← Integer M
  estado: string;           // ← Char(1) M
  fecha_registro: string;   // ← Timestamp M
}