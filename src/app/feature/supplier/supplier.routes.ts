import { Routes } from '@angular/router';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierResolver } from '../../core/resolvers/supplier.resolver';
import { CanDeactivateGuard } from '../../core/guards/can-deactivate.guard';

export const SUPPLIER_ROUTES: Routes = [
    { path: '', component: SupplierListComponent },
    { 
        path: 'form', 
        component: SupplierFormComponent,
        canDeactivate: [CanDeactivateGuard]
    },
    { 
        path: 'edit/:id', 
        component: SupplierFormComponent,
        resolve: {
            supplier: SupplierResolver
        },
        canDeactivate: [CanDeactivateGuard]
    }
];