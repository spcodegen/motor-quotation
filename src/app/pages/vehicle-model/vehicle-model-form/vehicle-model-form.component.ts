import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { TextAreaComponent } from "../../../shared/components/form/input/text-area.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { VehicleModelService } from '../vehicle-model.service';
import { VehicleModel, VehicleMakeResponse } from '../vehicle-model.model';
import { SelectComponent } from "../../../shared/components/form/select/select.component";
import { VehicleMakeService } from '../../vehicle-make/vehicle-make.service';

// Interface for dropdown options
interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-vehicle-model-form',
  imports: [
    CommonModule,
    FormsModule,
    ComponentCardComponent,
    LabelComponent,
    InputFieldComponent,
    TextAreaComponent,
    ButtonComponent,
    SelectComponent
  ],
  templateUrl: './vehicle-model-form.component.html',
  styleUrl: './vehicle-model-form.component.css'
})
export class VehicleModelFormComponent implements OnInit {
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Vehicle Make dropdown
  vehicleMakeOptions: SelectOption[] = [];
  selectedVehicleMakeId: string = '';
  
  // Form model - initialize with empty strings to avoid undefined
  vehicleModel: VehicleModel = {
    id: '',
    name: '',
    code: '',
    description: '',
    vehicleMakeId: '',
    vehicleMakeResponse: {} as VehicleMakeResponse,
  };

  private vehicleModelId: string | null = null;

  constructor(
    private vehicleModelService: VehicleModelService,
    private vehicleMakeService: VehicleMakeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.vehicleModelId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.vehicleModelId;

    // Load vehicle makes first
    this.loadVehicleMakes();

    if (this.isEditMode) {
      this.loadVehicleModelData(this.vehicleModelId!);
    }
  }

  loadVehicleMakes() {
    this.isLoading = true;
    
    this.vehicleMakeService.fetchVehicleMakes()
      .subscribe({
        next: (vehicleMakes) => {
          // Transform vehicle makes to dropdown options
          this.vehicleMakeOptions = vehicleMakes.map(make => ({
            value: make.id,
            label: `${make.name} (${make.code})`
          }));
          
          // Add a default option
          this.vehicleMakeOptions.unshift({
            value: '',
            label: 'Select Vehicle Make'
          });

          console.log('Vehicle makes loaded:', this.vehicleMakeOptions);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading vehicle makes:', error);
          this.errorMessage = 'Failed to load vehicle makes. Please try again.';
          
          // Set default options even if API fails
          this.vehicleMakeOptions = [
            { value: '', label: 'Select Vehicle Make' },
            { value: 'error', label: 'Failed to load makes' }
          ];
          this.isLoading = false;
        }
      });
  }

  handleSelectChange(value: string) {
    this.selectedVehicleMakeId = value;
    this.vehicleModel.vehicleMakeId = value;
    console.log('Selected Vehicle Make ID:', value);
  }

  // Handle input changes for text fields
  onInputChange(value: string | number, field: string) {
    // Convert to string if it's a number
    const stringValue = value.toString();
    
    // Update the specific field in the vehicleModel object
    (this.vehicleModel as any)[field] = stringValue;
    
    // Clear any existing error messages when user starts typing
    if (this.errorMessage) {
      this.errorMessage = null;
    }
    
    console.log(`Field ${field} updated to:`, stringValue);
  }

  loadVehicleModelData(id: string) {
    this.isLoading = true;
    this.errorMessage = null;

    this.vehicleModelService.getVehicleModelById(id)
      .subscribe({
        next: (response) => {
          this.vehicleModel = {
            ...response,
            // Ensure all required fields have values
            name: response.name || '',
            code: response.code || '',
            description: response.description || '',
            vehicleMakeId: response.vehicleMakeId || ''
          };

          // Set the selected vehicle make in dropdown for edit mode
          this.selectedVehicleMakeId = response.vehicleMakeId;
          
          this.isLoading = false;
          console.log('Vehicle model data loaded:', response);
        },
        error: (error) => {
          console.error('Error fetching vehicle model:', error);
          this.errorMessage = 'Failed to load vehicle model details.';
          this.isLoading = false;
        }
      });
  }

  onSubmit() {
    // Validate required fields
    if (!this.vehicleModel.name || !this.vehicleModel.code || !this.selectedVehicleMakeId) {
      this.errorMessage = 'Name, Code, and Vehicle Make are required fields.';
      return;
    }

    // Ensure vehicleMakeId is set from dropdown
    this.vehicleModel.vehicleMakeId = this.selectedVehicleMakeId;

    // Prepare the data for API call
    const formData = {
      name: this.vehicleModel.name.trim(),
      code: this.vehicleModel.code.trim(),
      description: this.vehicleModel.description.trim(),
      vehicleMakeId: this.vehicleModel.vehicleMakeId
    };

    console.log('Submitting form data:', formData);

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.isEditMode && this.vehicleModelId) {
      // Update existing vehicle model
      this.vehicleModelService.updateVehicleModel(this.vehicleModelId, formData)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.successMessage = 'Vehicle model updated successfully!';
            console.log('Vehicle model updated:', response);
            
            // Redirect back to list after delay
            setTimeout(() => {
              this.router.navigate(['/vehicle-model-list']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error updating vehicle model:', error);
            this.errorMessage = this.getErrorMessage(error) || 'Failed to update vehicle model. Please try again.';
            this.isSubmitting = false;
          }
        });
    } else {
      // Create new vehicle model
      this.vehicleModelService.createVehicleModel(formData)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.successMessage = 'Vehicle model created successfully!';
            console.log('Vehicle model created:', response);
            
            // Reset form for new entry
            this.resetForm();
            
            // Option: Redirect to list after delay (uncomment if needed)
            setTimeout(() => {
              this.router.navigate(['/vehicle-model-list']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error creating vehicle model:', error);
            this.errorMessage = this.getErrorMessage(error) || 'Failed to create vehicle model. Please try again.';
            this.isSubmitting = false;
          }
        });
    }
  }

  // Reset form after successful creation
  resetForm() {
    this.vehicleModel = {
      id: '',
      name: '',
      code: '',
      description: '',
      vehicleMakeId: '',
      vehicleMakeResponse: {} as VehicleMakeResponse,
    };
    this.selectedVehicleMakeId = '';
  }

  onCancel() {
    this.router.navigate(['/vehicle-model-list']);
  }

  // Helper method to get selected vehicle make name for display
  getSelectedVehicleMakeName(): string {
    const selectedMake = this.vehicleMakeOptions.find(option => option.value === this.selectedVehicleMakeId);
    return selectedMake ? selectedMake.label : 'Not selected';
  }

  // Helper method to extract error message from API response
  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.status === 0) {
      return 'Unable to connect to server. Please check your connection.';
    }
    if (error.status === 400) {
      return 'Invalid data provided. Please check your inputs.';
    }
    if (error.status === 409) {
      return 'A vehicle model with this code already exists.';
    }
    return error.message || 'An unexpected error occurred.';
  }
}