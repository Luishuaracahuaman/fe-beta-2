// shared/components/state-filter/state-filter.component.ts
import { Component, Output, EventEmitter, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StateFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

@Component({
  selector: 'app-state-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="state-filter">
      <button 
        (click)="setFilter('ALL')"
        [class.active]="currentFilter() === 'ALL'"
        class="filter-btn">
        <span>📋</span> Todos
      </button>
      <button 
        (click)="setFilter('ACTIVE')"
        [class.active]="currentFilter() === 'ACTIVE'"
        class="filter-btn">
        <span>✅</span> Activos
      </button>
      <button 
        (click)="setFilter('INACTIVE')"
        [class.active]="currentFilter() === 'INACTIVE'"
        class="filter-btn">
        <span>⏸️</span> Inactivos
      </button>
    </div>
  `,
  styles: [`
    .state-filter {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .filter-btn {
      padding: 10px 16px;
      border: 2px solid #e0e0e0;
      background: white;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .filter-btn:hover {
      background: #f8f9fa;
      border-color: #007bff;
      transform: translateY(-2px);
    }
    .filter-btn.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
      box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
    }
    .filter-btn span {
      font-size: 14px;
    }
  `]
})
export class StateFilterComponent {
  currentFilter = input<StateFilter>('ALL');
  @Output() filterChange = new EventEmitter<StateFilter>();

  setFilter(filter: StateFilter): void {
    this.filterChange.emit(filter);
  }
}