import { Component, inject, OnInit } from '@angular/core';
import { Garment } from '../../core/interfaces/garment';

import { GarmentFormComponent } from '../../feature/garment/garment-form/garment-form.component';
import { GarmentListComponent } from '../../feature/garment/garment-list/garment-list.component';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { GarmentService } from '../../core/services/garment.service';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-garment-page',
  standalone: true,
  templateUrl: './garment-page.component.html',
  styleUrls: ['./garment-page.component.scss'],
  imports: [
    CommonModule,
    GarmentFormComponent,
    GarmentListComponent,
    MatTableModule,
    MatIconModule
  ],
})
export class GarmentPageComponent implements OnInit {
  isMenuOpen = false;
  activeSection = 'prendas-tabla';

  mostrarForm = false;
  prendaEditando: Garment | null = null;

  prendas: Garment[] = [];

  private garmentService = inject(GarmentService);

  ngOnInit(): void {
    this.cargarPrendas();
  }

  cargarPrendas(): void {
    this.garmentService.findAll().subscribe({
      next: (response) => {
        this.prendas = [...response];
        console.log('----------------\nPrendas cargadas\n----------------');
      },
      error: (err) => {
        console.error('------------------------\nError al cargar prendas\n------------------------\n', err);
      }
    });
  }

  onEditar(prenda: Garment | null) {
    this.prendaEditando = prenda;
    this.mostrarForm = true;
  }

  onAgregar() {
    this.prendaEditando = null;
    this.mostrarForm = true;
  }

  onGuardar(nuevaPrenda: Garment) {
    if (nuevaPrenda.id === 0) {
      const { id, ...prendaSinId } = nuevaPrenda;
      this.garmentService.save(prendaSinId as Garment).subscribe({
        next: (prendaGuardada) => {
          this.prendas.push(prendaGuardada);
          this.mostrarForm = false;
          Swal.fire('Éxito', 'Prenda registrada correctamente', 'success');
        },
        error: (err) => {
          console.error('Error al guardar la prenda', err);
          Swal.fire('Error', `No se pudo registrar la prenda: ${err.message || err.statusText}`, 'error');
        }
      });
    } else {
      // Editar prenda
      this.garmentService.update(nuevaPrenda).subscribe({
        next: () => {
          const index = this.prendas.findIndex(p => p.id === nuevaPrenda.id);
          if (index !== -1) this.prendas[index] = nuevaPrenda;
          this.mostrarForm = false;
          Swal.fire('Éxito', 'Prenda actualizada correctamente', 'success');
        },
        error: (err) => {
          console.error('Error al actualizar la prenda', err);
          Swal.fire('Error', 'No se pudo actualizar la prenda', 'error');
        }
      });
    }
  }

  onEliminar(id: number) {
    const prenda = this.prendas.find(p => p.id === id);
    if (prenda) {
      prenda.state = 'I';
      this.garmentService.delete(id).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Prenda eliminada (inactivada)', 'success');
        },
        error: (err) => {
          console.error('Error al eliminar (inactivar) la prenda', err);
          Swal.fire('Error', 'No se pudo eliminar la prenda', 'error');
        }
      });
    }
  }

  onRestaurar(id: number) {
    const prenda = this.prendas.find(p => p.id === id);
    if (prenda) {
      prenda.state = 'A';
      this.garmentService.restore(id).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Prenda restaurada (activada)', 'success');
        },
        error: (err) => {
          console.error('Error al restaurar (activar) la prenda', err);
          Swal.fire('Error', 'No se pudo restaurar la prenda', 'error');
        }
      });
    }
  }

  onCancelar() {
    this.mostrarForm = false;
  }

  onReiniciar() {
    this.cargarPrendas(); // Vuelve a cargar desde el backend
  }

  cerrarPorClickExterior(event: MouseEvent) {
    this.mostrarForm = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    this.isMenuOpen = false;
  }
}
