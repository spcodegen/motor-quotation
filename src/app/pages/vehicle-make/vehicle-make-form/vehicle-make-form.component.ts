import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { TextAreaComponent } from "../../../shared/components/form/input/text-area.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { VehicleMakeService } from '../vehicle-make.service';
import { VehicleMake } from '../vehicle-make.model';

@Component({
  selector: 'app-vehicle-make-form',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonComponent, 
    TextAreaComponent, 
    LabelComponent, 
    InputFieldComponent, 
    ComponentCardComponent
  ],
  templateUrl: './vehicle-make-form.component.html',
})
export class VehicleMakeFormComponent implements OnInit {
  vehicleMake: VehicleMake = {
    id: '',
    name: '',
    code: '',
    description: '',
  };

  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleMakeService: VehicleMakeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.loadVehicleMake(String(id));
      }
    });
  }

  loadVehicleMake(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.vehicleMakeService.getVehicleMakeById(id).subscribe({
      next: (response) => {
        this.vehicleMake = response;
        this.isLoading = false;
        console.log('Vehicle make loaded:', response);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load vehicle make details.';
        this.isLoading = false;
        console.error('Error loading vehicle make:', error);
      }
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.isEditMode) {
      // Update existing vehicle make
      this.vehicleMakeService.updateVehicleMake(this.vehicleMake)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.successMessage = 'Vehicle make updated successfully!';
            console.log('Vehicle make updated:', response);
            // Optional: Redirect after delay
            setTimeout(() => {
              this.router.navigate(['/vehicle-make-list']);
            }, 2000);
          },
          error: (error) => {
            this.errorMessage = 'Failed to update vehicle make. Please try again.';
            this.isSubmitting = false;
            console.error('Error updating vehicle make:', error);
          }
        });
    } else {
      // Create new vehicle make
      this.vehicleMakeService.createVehicleMake(this.vehicleMake)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.successMessage = 'Vehicle make created successfully!';
            console.log('Vehicle make created:', response);
            // Optional: Redirect after delay
            setTimeout(() => {
              this.router.navigate(['/vehicle-make-list']);
            }, 2000);
          },
          error: (error) => {
            this.errorMessage = 'Failed to create vehicle make. Please try again.';
            this.isSubmitting = false;
            console.error('Error creating vehicle make:', error);
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/vehicle-make-list']);
  }

  // Clear messages when user starts typing
  onInputChange(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}