import { Routes } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: SidebarComponent,
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component: HomeComponent
            },
            // LAZY LOADING PARA GARMENTS
            {
                path: 'garments',
                loadChildren: () => import('./feature/garment/garment.routes').then(m => m.GARMENT_ROUTES)
            },
            // LAZY LOADING PARA SUPPLIERS
            {
                path: 'suppliers',
                loadChildren: () => import('./feature/supplier/supplier.routes').then(m => m.SUPPLIER_ROUTES)
            }
        ]
    }
];