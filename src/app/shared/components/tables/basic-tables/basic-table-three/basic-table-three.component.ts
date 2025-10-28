import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../../ui/button/button.component';
import { RouterLink } from "@angular/router";
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface VehicleMake {
  name: string;
  code: string;
  description: string;
}

@Component({
  selector: 'app-basic-table-three',
  imports: [
    CommonModule,
    ButtonComponent,
    RouterLink,
    HttpClientModule,   // ✅ Add this line
],
  templateUrl: './basic-table-three.component.html',
  styles: ``
})


export class BasicTableThreeComponent {

  vehicleMakeData: VehicleMake[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchVehicleMakes();
  }

  fetchVehicleMakes() {
    this.isLoading = true;
    this.errorMessage = null;

    this.http.get<VehicleMake[]>('http://172.21.112.154:8080/vehicleMake/getAllActive')
      .subscribe({
        next: (response) => {
          // Assuming API returns an array of objects with name, code, description
          this.vehicleMakeData = response;
          this.isLoading = false;
          console.log(response);
          
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.errorMessage = 'Failed to load vehicle makes.';
          this.isLoading = false;
        }
      });
  }

  get totalPages(): number {
    return Math.ceil(this.vehicleMakeData.length / this.itemsPerPage);
  }

  get currentItems(): VehicleMake[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.vehicleMakeData.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  handleViewMore(item: VehicleMake) {
    console.log('View More:', item);
  }

  handleDelete(item: VehicleMake) {
    console.log('Delete:', item);
  }
}
