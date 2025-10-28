// garment-list.component.ts - CORREGIDO
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Garment } from '../../../core/interfaces/garment';
import { GarmentService } from '../../../core/services/garment.service';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StateTransformPipe } from '../../../core/pipes/state-transform.pipe';
import { StateFilterComponent, StateFilter } from '../../../shared/components/state-filter/state-filter.component';

@Component({
  selector: 'app-garment-list',
  templateUrl: './garment-list.component.html',
  styleUrls: ['./garment-list.component.scss'],
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule, 
    StateTransformPipe,
    StateFilterComponent
  ],
  standalone: true
})
export class GarmentListComponent {
  @Input() prendas: Garment[] = [];
  @Output() editarPrenda = new EventEmitter<Garment | null>();
  @Output() eliminarPrenda = new EventEmitter<number>();
  @Output() restaurarPrenda = new EventEmitter<number>();
  @Output() recargarDatos = new EventEmitter<void>();
  garmentService = inject(GarmentService);

  busquedaNombre: string = '';
  filtroEstado: string = 'A';

  // Manejar cambio del filtro reutilizable
  onStateFilterChange(filter: StateFilter): void {
    switch(filter) {
      case 'ALL': 
        this.filtroEstado = 'T'; 
        break;
      case 'ACTIVE': 
        this.filtroEstado = 'A'; 
        break;
      case 'INACTIVE': 
        this.filtroEstado = 'I'; 
        break;
    }
  }

  // Manejar cambio del select
  onSelectChange(): void {
    // Se mantiene para compatibilidad
  }

  // Propiedad computada para el filtro actual
  get currentStateFilter(): StateFilter {
    switch(this.filtroEstado) {
      case 'T': return 'ALL';
      case 'A': return 'ACTIVE';
      case 'I': return 'INACTIVE';
      default: return 'ALL';
    }
  }

  get prendasFiltradas(): Garment[] {
    return this.prendas.filter(p => {
      const coincideNombre = p.nombre.toLowerCase().includes(this.busquedaNombre.toLowerCase()); // ← nombre
      const coincideEstado = this.filtroEstado === 'T' || p.estado === this.filtroEstado; // ← estado
      return coincideNombre && coincideEstado;
    });
  }

  reiniciar() {
    this.busquedaNombre = '';
    this.filtroEstado = 'A';
    this.recargarDatos.emit();
  }

  agregarPrenda() {
    this.editarPrenda.emit(null);
  }

  editar(prenda: Garment) {
    this.editarPrenda.emit(prenda);
  }

  eliminar(id: number) {
    if (confirm('¿Está seguro de eliminar esta prenda?')) {
      this.eliminarPrenda.emit(id);
    }
  }

  restaurar(id: number) {
    if (confirm('¿Está seguro de restaurar esta prenda?')) {
      this.restaurarPrenda.emit(id);
    }
  }

  reportPdf() {
    this.garmentService.reportPdf().subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_prendas_${new Date().getTime()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }
}