import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { BasicTableThreeComponent } from '../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { VehicleMakeService } from '../vehicle-make.service';

interface VehicleMake {
  id:string;
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
  errorMessage: string | null = null;
  editIcon: string = '/images/icons/edit.svg';
  deleteIcon: string = '/images/icons/delete.svg';

  constructor(
    private vehicleMakeService: VehicleMakeService,
    private router:Router
  ) {}

  ngOnInit() {
    this.fetchVehicleMakes();
  }

  fetchVehicleMakes(): void {
    this.isLoading = true;
    this.errorMessage = null;

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

  //Edit button click handler
  onEditVehicleMake(vehicleMakeId: string):void {
    console.log('Edit button clicked for ID:', vehicleMakeId); 

    this.vehicleMakeService.getVehicleMakeById(vehicleMakeId).subscribe({
      next:(vehicleMake)=>{
        console.log('Vehicle Make Name',vehicleMake.name);
        console.log('Vehicle Make Code',vehicleMake.code);
        console.log('Vehicle Make description',vehicleMake.description);

        // You can add navigation to edit form here:
        this.router.navigate(['vehicle-make-form/edit/',vehicleMakeId])
        
      },
      error:(error)=>{
        console.log('Error fetching vehicle make details:', error);
      }
    })
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
