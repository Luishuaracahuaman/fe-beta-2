import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Garment } from '../interfaces/garment';
import { GarmentService } from '../services/garment.service';

@Injectable({ providedIn: 'root' })
export class GarmentResolver implements Resolve<Garment> {
  constructor(private garmentService: GarmentService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Garment> {
    const id = Number(route.paramMap.get('id'));
    return this.garmentService.findById(id);
  }
}