import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierListComponent } from '../../../feature/supplier/supplier-list/supplier-list.component';

@Component({
  selector: 'app-supplier-page',
  template: `
    <app-supplier-list></app-supplier-list>
  `,
  styleUrls: ['./supplier-page.component.scss'],
  imports: [CommonModule, SupplierListComponent],
  standalone: true
})
export class SupplierPageComponent {}