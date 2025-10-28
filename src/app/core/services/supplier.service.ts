import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Supplier } from '../interfaces/supplier';
import { Observable, catchError, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = `${environment.urlBackEnd}/v1/api/supplier`;

  constructor(private http: HttpClient) {
    console.log('SupplierService inicializado. URL base:', this.apiUrl);
  }

  // Método de prueba de conexión corregido
  testConnection(): Observable<{status: string, message: string}> {
    console.log('Probando conexión con el backend');
    return this.http.get<{status: string, message: string}>(`${this.apiUrl}/health`).pipe(
      tap(response => console.log('Respuesta de conexión:', response)),
      catchError(this.handleError)
    );
  }

  // Métodos existentes con mejor manejo de tipos
  findAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  findById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  save(supplier: Omit<Supplier, 'id'>): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier).pipe(
      catchError(this.handleError)
    );
  }

  update(supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(this.apiUrl, supplier).pipe(
      catchError(this.handleError)
    );
  }

  deleteLogic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  restoreLogic(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/restore`, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en SupplierService:', error);
    let errorMessage = 'Error al comunicarse con el servidor';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Datos inválidos';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status) {
      errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}