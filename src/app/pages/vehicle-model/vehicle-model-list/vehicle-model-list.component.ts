import { Component } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { BasicTableThreeComponent } from "../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { VehicleModelService } from '../vehicle-model.service';
import { VehicleModel } from '../vehicle-model.model';

@Component({
  selector: 'app-vehicle-model-list',
  imports: [
    ButtonComponent,
    ButtonComponent,
    RouterLink,
    HttpClientModule,
    NgClass,
    NgIf
],
  templateUrl: './vehicle-model-list.component.html',
  styleUrl: './vehicle-model-list.component.css'
})

export class VehicleModelListComponent {
  vehicleModelData: VehicleModel[] = [];
  filteredVehicleModels: VehicleModel[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  isLoading = false;
  isDeleting = false;
  deletingId: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  searchTerm = '';
  editIcon: string = '/images/icons/edit.svg';
  deleteIcon: string = '/images/icons/delete.svg';

  constructor(
    private vehicleModelService: VehicleModelService,
    private router:Router
  ) {}

  ngOnInit() {
    this.fetchVehicleModels();
  }

   fetchVehicleModels() {
    this.isLoading = true;
    this.errorMessage = null;

    this.vehicleModelService.getAllActiveVehicleModels()
      .subscribe({
        next: (response) => {
          this.vehicleModelData = response;
          this.filteredVehicleModels = response;
          this.isLoading = false;
          console.log('Vehicle models loaded:', response);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.errorMessage = 'Failed to load vehicle models. Please try again.';
          this.isLoading = false;
        }
      });
  }

  handleEdit(item: VehicleModel) {
    console.log('Edit:', item);
    // Navigate to edit form with the vehicle model ID
    this.router.navigate(['/vehicle-model-form/edit',item]);
  }

  get totalPages(): number {
    return Math.ceil(this.vehicleModelData.length / this.itemsPerPage);
  }

  get currentItems(): VehicleModel[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.vehicleModelData.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  handleViewMore(item: VehicleModel) {
    console.log('View More:', item);
  }

   handleDelete(item: VehicleModel) {
    console.log("ok");
    
    if (confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      this.isDeleting = true;
      this.deletingId = item.id;
      this.errorMessage = null;
      this.successMessage = null;

      this.vehicleModelService.deleteVehicleModel(item.id)
        .subscribe({
          next: () => {
            console.log('Vehicle model deleted successfully:', item.name);
            this.successMessage = `Vehicle model "${item.name}" deleted successfully.`;
            this.isDeleting = false;
            this.deletingId = null;
            
            // Refresh the list after successful deletion
            this.fetchVehicleModels();
            
            // Reset success message after 3 seconds
            setTimeout(() => {
              this.successMessage = null;
            }, 3000);
          },
          error: (error) => {
            console.error('Error deleting vehicle model:', error);
            this.errorMessage = `Failed to delete "${item.name}". Please try again.`;
            this.isDeleting = false;
            this.deletingId = null;
            
            // Reset error message after 5 seconds
            setTimeout(() => {
              this.errorMessage = null;
            }, 5000);
          }
        });
    }
  }

}
