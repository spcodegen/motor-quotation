import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleMakeComponent } from './vehicle-make.component';

describe('VehicleMakeComponent', () => {
  let component: VehicleMakeComponent;
  let fixture: ComponentFixture<VehicleMakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleMakeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleMakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
