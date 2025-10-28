import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Garment } from '../../../core/interfaces/garment';
import { CommonModule } from '@angular/common';
import { noFutureDateValidator } from '../../../shared/validators/date.validators';
import { CanComponentDeactivate } from '../../../core/guards/can-deactivate.guard';

@Component({
  selector: 'app-garment-form',
  templateUrl: './garment-form.component.html',
  styleUrls: ['./garment-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  standalone: true
})
export class GarmentFormComponent implements OnChanges, CanComponentDeactivate {
  @Input() prenda: Garment | null = null;
  @Output() guardar = new EventEmitter<Garment>();

  garmentForm: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.garmentForm = this.fb.group({
      identificador: [0],  // ← CORREGIDO
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^(?!.* {2,})[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\-]+( [A-Za-zÁÉÍÓÚÑáéíóúñ0-9\-]+)*$/)]],  // ← CORREGIDO
      talla_prenda: ['', [Validators.required, Validators.maxLength(1), Validators.pattern(/^(S|M|L|X)$/)]],  // ← CORREGIDO (Char(1) en BD)
      color: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^(?!.* {2,})[A-Za-zÁÉÍÓÚÑáéíóúñ]+( [A-Za-zÁÉÍÓÚÑáéíóúñ]+)*$/)]],
      precio_sugerido: [0, [Validators.required, Validators.min(30), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],  // ← CORREGIDO
      stock: [0, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
      estado: ['A', Validators.required],  // ← CORREGIDO
      fecha_registro: [this.getCurrentDateTimeLocal(), [Validators.required, noFutureDateValidator]],  // ← CORREGIDO
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prenda'] && this.prenda) {
      this.garmentForm.patchValue(this.prenda);
    } else if (changes['prenda'] && this.prenda === null) {
      this.clearForm();
    }
  }

  canDeactivate(): boolean {
    if (this.garmentForm.dirty && !this.formSubmitted) {
      return confirm('⚠️ ¿Estás seguro de que quieres salir? Tienes cambios sin guardar en el formulario de prendas.');
    }
    return true;
  }

  onSubmit() {
    if (this.garmentForm.valid) {
      this.formSubmitted = true;
      this.guardar.emit(this.garmentForm.value);
      this.clearForm();
    }
  }

  esInvalido(campo: string): boolean {
    const control = this.garmentForm.get(campo);
    return !!control && control.invalid && control.touched;
  }

  clearForm() {
    this.formSubmitted = false;
    this.garmentForm.reset({
      identificador: 0,
      nombre: '',
      talla_prenda: '',
      color: '',
      precio_sugerido: null,
      stock: null,
      estado: 'A',
      fecha_registro: this.getCurrentDateTimeLocal()
    });
  }

  private getCurrentDateTimeLocal(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60000));
    return localDate.toISOString().slice(0, 16);
  }
}