import { Routes } from '@angular/router';
import { GarmentFormComponent } from './garment-form/garment-form.component';
//import { GarmentListComponent } from './garment-list/garment-list.component';
import { GarmentPageComponent } from '../../pages/garment-page/garment-page.component';
import { GarmentResolver } from '../../core/resolvers/garment.resolver';
import { CanDeactivateGuard } from '../../core/guards/can-deactivate.guard';

export const GARMENT_ROUTES: Routes = [
    //{ path: '', component: GarmentListComponent },
    { path: '', component: GarmentPageComponent },
    { 
        path: 'form', 
        component: GarmentFormComponent,
        canDeactivate: [CanDeactivateGuard]
    },
    { 
        path: 'edit/:id', 
        component: GarmentFormComponent,
        resolve: {
            garment: GarmentResolver
        },
        canDeactivate: [CanDeactivateGuard]
    }
];