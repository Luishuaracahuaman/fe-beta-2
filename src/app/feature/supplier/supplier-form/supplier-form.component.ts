import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Supplier } from '../../../core/interfaces/supplier';
import { CommonModule } from '@angular/common';
import { CanComponentDeactivate } from '../../../core/guards/can-deactivate.guard';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class SupplierFormComponent implements OnInit, CanComponentDeactivate {
  @Input() proveedor: Supplier | null = null;
  @Output() guardar = new EventEmitter<Supplier>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      identifier: [null],
      companyName: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      ruc: ['', [
        Validators.required, 
        Validators.pattern(/^\d{11}$/),
        Validators.maxLength(11)
      ]],
      phone: ['', [
        Validators.required, 
        Validators.pattern(/^9\d{8}$/),
        Validators.maxLength(9)
      ]],
      address: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(50)
      ]],
      state: ['A'],
      registerDate: [new Date().toISOString()]
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['supplier']) {
        this.proveedor = data['supplier'];
        if (this.proveedor && this.proveedor.registerDate) {
          this.form.patchValue({
            ...this.proveedor,
            registerDate: this.formatDateForInput(this.proveedor.registerDate)
          });
        }
      }
    });

    if (this.proveedor) {
      this.form.patchValue({
        ...this.proveedor,
        registerDate: this.formatDateForInput(this.proveedor.registerDate)
      });
    }
  }

  canDeactivate(): boolean {
    if (this.form.dirty && !this.formSubmitted) {
      return confirm('⚠️ ¿Estás seguro de que quieres salir? Tienes cambios sin guardar en el formulario de proveedores.');
    }
    return true;
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmitted = true;
      const formData = this.form.value;
      const supplierData: Supplier = {
        identifier: this.proveedor?.identifier || 0,
        companyName: formData.companyName,
        ruc: formData.ruc,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        state: 'A',
        registerDate: new Date().toISOString()
      };
      this.guardar.emit(supplierData);
    }
  }

  private formatDateForInput(dateString: string): string {
    return dateString ? new Date(dateString).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
  }

  esInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onCancel() {
    this.cancelar.emit();
  }
}