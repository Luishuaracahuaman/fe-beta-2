import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Garment } from '../interfaces/garment';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GarmentService {

  private http = inject(HttpClient);
  private urlBackEnd = `${environment.urlBackEnd}/v1/api/garment`;

  private selectedGarmentSubject = new BehaviorSubject<Garment | null>(null);
  selectedGarment$ = this.selectedGarmentSubject.asObservable();

  setSelectedGarment(garment: Garment | null): void {
    this.selectedGarmentSubject.next(garment);
  }

  findAll() {
    return this.http.get<Garment[]>(this.urlBackEnd);
  }

  findById(id: number) {
    return this.http.get<Garment>(`${this.urlBackEnd}/${id}`);
  }

  findByState(state: string) {
    return this.http.get<Garment[]>(`${this.urlBackEnd}/filter/${state}`);
  }

  save(garment: Garment) {
    return this.http.post<Garment>(`${this.urlBackEnd}/save`, garment);
  }

  update(garment: Garment) {
    // El backend espera el ID dentro del body (no en URL)
    return this.http.put<Garment>(`${this.urlBackEnd}/update`, garment);
  }

  delete(id: number) {
    // El backend usa DELETE 
    return this.http.delete<void>(`${this.urlBackEnd}/delete/${id}`);
  }

  restore(id: number) {
    return this.http.patch<void>(`${this.urlBackEnd}/restore/${id}`, {});
  }

  reportPdf() {
    return this.http.get(`${this.urlBackEnd}/pdf`, { responseType: 'blob' });
  }

}
