import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { VehicleMakeService } from '../vehicle-make.service';

interface VehicleMake {
  id: string;
  name: string;
  code: string;
  description: string;
}

@Component({
  selector: 'app-vehicle-make-list',
  imports: [
    ButtonComponent,
    RouterLink,
    HttpClientModule,
    NgClass
  ],
  templateUrl: './vehicle-make-list.component.html',
})
export class VehicleMakeListComponent {

  vehicleMakeData: VehicleMake[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  isLoading = false;
  isDeleting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  editIcon: string = '/images/icons/edit.svg';
  deleteIcon: string = '/images/icons/delete.svg';

  constructor(
    private vehicleMakeService: VehicleMakeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchVehicleMakes();
  }

  //Fetch vehicleMakes
  fetchVehicleMakes(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.vehicleMakeService.fetchVehicleMakes().subscribe({
      next: (response) => {
        this.vehicleMakeData = response;
        this.isLoading = false;
        console.log('Vehicle makes:', response);
      },
      error: (error) => {
        console.error('Error fetching vehicle makes:', error);
        this.errorMessage = 'Failed to load vehicle makes.';
        this.isLoading = false;
      }
    });
  }

  // Edit button click handler - simplified
  onEditVehicleMake(vehicleMakeId: string): void {
    console.log('Edit button clicked for ID:', vehicleMakeId);
    // Navigate directly to edit form without fetching data first
    this.router.navigate(['/vehicle-make-form/edit', vehicleMakeId]);
  }

  // Delete button click handler
  onDeleteVehicleMake(vehicleMakeId: string, vehicleMakeName: string): void {
    console.log('Delete button clicked for ID:', vehicleMakeId);
    
    // Confirmation dialog
    const isConfirmed = confirm(`Are you sure you want to delete "${vehicleMakeName}"? This action cannot be undone.`);
    
    if (isConfirmed) {
      this.deleteVehicleMake(vehicleMakeId, vehicleMakeName);
    }
  }

  // Delete service call
  private deleteVehicleMake(id: string, name: string): void {
    this.isDeleting = true;
    this.errorMessage = null;
    this.successMessage = null;

    console.log('Deleting vehicle make with ID:', id);
    
    this.vehicleMakeService.deleteVehicleMake(id).subscribe({
      next: () => {
        console.log('Vehicle make deleted successfully');
        this.isDeleting = false;
        this.successMessage = `Vehicle make "${name}" deleted successfully!`;
        
        // Reload the list to reflect changes
        this.fetchVehicleMakes();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        console.error('Error deleting vehicle make:', error);
        this.isDeleting = false;
        this.errorMessage = `Failed to delete vehicle make "${name}". Please try again.`;
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = null;
        }, 5000);
      }
    });
  }

  // Clear messages
  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
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