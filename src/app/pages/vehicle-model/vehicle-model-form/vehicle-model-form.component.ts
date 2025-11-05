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
  vehicleMakes: any[] = [];
  
  // Form model
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

    // Load vehicle makes first, then load vehicle model data
    this.loadVehicleMakes().then(() => {
      if (this.isEditMode && this.vehicleModelId) {
        this.loadVehicleModelData(this.vehicleModelId);
      }
    });

  }

  async loadVehicleMakes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      
      this.vehicleMakeService.fetchVehicleMakes().subscribe({
        next: (response: any) => {
          this.vehicleMakes = response;
          
          // Transform vehicle makes to dropdown options
          this.vehicleMakeOptions = response.map((make: any) => ({
            value: make.id,
            label: `${make.name} (${make.code})`
          }));
          
          // Add a default option at the beginning
          this.vehicleMakeOptions.unshift({
            value: '',
            label: 'Select Vehicle Make'
          });

          console.log('Vehicle makes loaded:', this.vehicleMakeOptions);
          this.isLoading = false;
          resolve();
        },
        error: (error) => {
          console.error('Error loading vehicle makes:', error);
          this.errorMessage = 'Failed to load vehicle makes. Please try again.';
          
          this.vehicleMakeOptions = [
            { value: '', label: 'Select Vehicle Make' }
          ];
          this.isLoading = false;
          reject(error);
        }
      });
    });
  }

  handleSelectChange(value: string) {
    console.log('Dropdown changed to:', value);
    this.selectedVehicleMakeId = value;
    this.vehicleModel.vehicleMakeId = value;
    
    if (value && this.errorMessage?.includes('Vehicle Make')) {
      this.errorMessage = null;
    }
  }

  // Force set dropdown value
  setDropdownValue(value: string) {
    console.log('Setting dropdown value to:', value);
    this.selectedVehicleMakeId = value;

    // Force change detection
    setTimeout(() => {
      console.log('Dropdown value after timeout:', this.selectedVehicleMakeId);
    }, 0);
  }

  onInputChange(value: string | number, field: string) {
    const stringValue = value.toString();
    (this.vehicleModel as any)[field] = stringValue;
    
    if (this.errorMessage) {
      this.errorMessage = null;
    }
  }

  loadVehicleModelData(id: string) {
    this.isLoading = true;
    this.errorMessage = null;

    this.vehicleModelService.getVehicleModelById(id)
      .subscribe({
        next: (response) => {
          console.log('API Response:', response);
          
          this.vehicleModel = {
            ...response,
            name: response.name || '',
            code: response.code || '',
            description: response.description || '',
            vehicleMakeId: response.vehicleMakeResponse.id || ''
          };

          console.log('Vehicle Make ID from API:', response.vehicleMakeResponse.id);
          console.log('Available options:', this.vehicleMakeOptions);

          // Set the dropdown value - this is the key fix
          if (response.vehicleMakeResponse) {
            this.setDropdownValue(response.vehicleMakeResponse.id);
            
            // Double check if the value exists in options
            const optionExists = this.vehicleMakeOptions.some(opt => opt.value === response.vehicleMakeResponse.id);
            console.log('Option exists in dropdown:', optionExists);
            
            if (!optionExists) {
              console.warn('Vehicle make ID not found in options:', response.vehicleMakeResponse.id);
              this.errorMessage = `Warning: Associated vehicle make not found in available options.`;
            }
          }

          this.isLoading = false;
          console.log('Form data fully loaded');
        },
        error: (error) => {
          console.error('Error fetching vehicle model:', error);
          this.errorMessage = 'Failed to load vehicle model details.';
          this.isLoading = false;
        }
      });
  }

  onSubmit() {
    if (!this.selectedVehicleMakeId) {
      this.errorMessage = 'Vehicle Make is required.';
      return;
    }

    if (!this.vehicleModel.name?.trim()) {
      this.errorMessage = 'Name is required.';
      return;
    }

    if (!this.vehicleModel.code?.trim()) {
      this.errorMessage = 'Code is required.';
      return;
    }

    this.vehicleModel.vehicleMakeId = this.selectedVehicleMakeId;

    const formData = {
      name: this.vehicleModel.name.trim(),
      code: this.vehicleModel.code.trim(),
      description: this.vehicleModel.description?.trim() || '',
      vehicleMakeId: this.vehicleModel.vehicleMakeId
    };

    // Include ID for update
    if (this.isEditMode && this.vehicleModelId) {
      (formData as any).id = this.vehicleModelId;
    }

    console.log('Submitting form data:', formData);

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.isEditMode && this.vehicleModelId) {
      this.vehicleModelService.updateVehicleModel(formData)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.successMessage = 'Vehicle model updated successfully!';
            this.resetForm();
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
      this.vehicleModelService.createVehicleModel(formData)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.successMessage = 'Vehicle model created successfully!';
            this.resetForm();
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

  getSelectedVehicleMakeName(): string {
    if (!this.selectedVehicleMakeId) return 'Not selected';
    
    const selectedMake = this.vehicleMakes.find(make => make.id === this.selectedVehicleMakeId);
    return selectedMake ? `${selectedMake.name} (${selectedMake.code})` : 'Unknown make';
  }

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

  retryLoadVehicleMakes() {
    this.errorMessage = null;
    this.loadVehicleMakes().then(() => {
      if (this.isEditMode && this.vehicleModelId) {
        this.loadVehicleModelData(this.vehicleModelId);
      }
    });
  }

  // Test method to manually set dropdown
  testSetDropdown() {
    if (this.vehicleMakeOptions.length > 1) {
      const testValue = this.vehicleMakeOptions[1].value;
      console.log('Testing dropdown set to:', testValue);
      this.setDropdownValue(testValue);
    }
  }
}