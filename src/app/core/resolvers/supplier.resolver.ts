import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Supplier } from '../interfaces/supplier';
import { SupplierService } from '../services/supplier.service';

@Injectable({ providedIn: 'root' })
export class SupplierResolver implements Resolve<Supplier> {
  constructor(private supplierService: SupplierService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Supplier> {
    const id = Number(route.paramMap.get('id'));
    return this.supplierService.findById(id);
  }
}