import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarmentPageComponent } from './garment-page.component';

describe('GarmentPageComponent', () => {
  let component: GarmentPageComponent;
  let fixture: ComponentFixture<GarmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarmentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GarmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
