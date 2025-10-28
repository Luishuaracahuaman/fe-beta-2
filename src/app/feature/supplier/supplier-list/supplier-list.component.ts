import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SupplierService } from '../../../core/services/supplier.service';
import { SupplierFormComponent } from '../supplier-form/supplier-form.component';
import { Supplier } from '../../../core/interfaces/supplier';
import { StateTransformPipe } from '../../../core/pipes/state-transform.pipe';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
  imports: [CommonModule, FormsModule, MatIconModule, SupplierFormComponent, StateTransformPipe],
  standalone: true
})
export class SupplierListComponent implements OnInit {
  proveedores: Supplier[] = [];
  proveedoresFiltrados: Supplier[] = [];
  proveedorEditando: Supplier | null = null;
  mostrarFormulario = false;
  cargando = true;
  error: string | null = null;
  busquedaNombre = '';
  filtroEstado = 'A';

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.cargando = true;
    this.error = null;
    
    this.supplierService.findAll().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.filtrarProveedores();
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar proveedores';
        this.cargando = false;
      }
    });
  }

  filtrarProveedores(): void {
    let filtrados = [...this.proveedores];

    if (this.filtroEstado !== 'T') {
      filtrados = filtrados.filter(p => p.state === this.filtroEstado);
    }

    if (this.busquedaNombre.trim()) {
      const termino = this.busquedaNombre.toLowerCase().trim();
      filtrados = filtrados.filter(p =>
        p.companyName.toLowerCase().includes(termino)
      );
    }

    this.proveedoresFiltrados = filtrados;
  }

  reiniciar(): void {
    this.busquedaNombre = '';
    this.filtroEstado = 'A';
    this.filtrarProveedores();
  }

  nuevoProveedor(): void {
    this.proveedorEditando = null;
    this.mostrarFormulario = true;
  }

  editarProveedor(proveedor: Supplier): void {
    this.proveedorEditando = { ...proveedor };
    this.mostrarFormulario = true;
  }

  guardarProveedor(proveedor: Supplier): void {
    const operacion = proveedor.identifier 
      ? this.supplierService.update(proveedor)
      : this.supplierService.save(proveedor);

    operacion.subscribe({
      next: () => {
        this.cargarProveedores();
        this.mostrarFormulario = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al guardar proveedor';
      }
    });
  }

  cambiarEstado(id: number, nuevoEstado: 'A' | 'I'): void {
    const confirmacion = confirm(`¿Está seguro de ${nuevoEstado === 'A' ? 'activar' : 'desactivar'} este proveedor?`);
    if (!confirmacion) return;

    const operacion = nuevoEstado === 'A' 
      ? this.supplierService.restoreLogic(id)
      : this.supplierService.deleteLogic(id);

    operacion.subscribe({
      next: () => {
        const index = this.proveedores.findIndex(p => p.identifier === id);
        if (index !== -1) {
          this.proveedores[index].state = nuevoEstado;
          this.filtrarProveedores();
        }
      },
      error: (err) => {
        this.error = err.message || 'Error al cambiar estado';
      }
    });
  }
}