// core/interceptors/error.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      console.error('HTTP Error:', error);
      
      let errorMessage = 'Ha ocurrido un error';
      if (error.status === 401) {
        errorMessage = 'No autorizado';
        // Aquí podrías redirigir al login
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status >= 500) {
        errorMessage = 'Error del servidor';
      }
      
      return throwError(() => new Error(errorMessage));
    })
  );
};