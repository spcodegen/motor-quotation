import { Component, OnInit } from '@angular/core';
import { VehicleMake } from '../vehicle-make.model';
import { VehicleMakeService } from '../vehicle-make.service';

@Component({
  selector: 'app-vehicle-make',
  imports: [],
  templateUrl: './vehicle-make.component.html',
  styleUrl: './vehicle-make.component.css'
})
export class VehicleMakeComponent implements OnInit {
  vehicleMakes: VehicleMake[] = [];
  loading = false;
  error = '';

displayedColumns: string[] = ['id', 'name', 'code', 'description'];

constructor(private vehicleMakeService: VehicleMakeService) { }

  ngOnInit(): void {
    this.loadVehicleMakes();
  }

  loadVehicleMakes(): void {
    this.loading = true;
    this.error = '';

    this.vehicleMakeService.getAllActiveVehicleMakes().subscribe({
      next: (data) => {
        this.vehicleMakes = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load vehicle makes. Please try again later.';
        this.loading = false;
        console.error('Error loading vehicle makes:', error);
      }
    });
  }

  refresh(): void {
    this.loadVehicleMakes();
  }
}
