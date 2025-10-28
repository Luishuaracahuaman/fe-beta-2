import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stateTransform',
  standalone: true
})
export class StateTransformPipe implements PipeTransform {
  transform(value: string): string {
    switch(value) {
      case 'A': return 'Activo';
      case 'I': return 'Inactivo';
      case 'T': return 'Todos';
      default: return value;
    }
  }
}