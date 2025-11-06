import { Component } from '@angular/core';
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { SelectComponent } from "../../../shared/components/form/select/select.component";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";

@Component({
  selector: 'app-motor-quotation-form',
  imports: [LabelComponent, InputFieldComponent, SelectComponent, ComponentCardComponent],
  templateUrl: './motor-quotation-form.component.html',
  styleUrl: './motor-quotation-form.component.css'
})
export class MotorQuotationFormComponent {

  message = '';
  selectedYear: string = '';
  selectedModel: string = '';
  selectedMake: string = '';
  // Generate years from 1950 to current year + 1
  yearOptions: any[] = this.generateYearOptions();
  
  
  showPassword = false;
  makeOptions = [
    { value: 'toyota', label: 'Toyota' },
    { value: 'honda', label: 'Honda' },
    { value: 'audi', label: 'Audi' },
  ];
   // Model options for vehicle usage type
  modelOptions: any[] = [
    { label: 'Private', value: 'private' },
    { label: 'Hiring', value: 'hiring' },
    { label: 'Rent', value: 'rent' }
  ];
  selectedOption = '';
  dateValue: any;
  timeValue = '';
  cardNumber = '';

  handleModelChange(model: string): void {
    this.selectedModel = model;
    console.log('Selected vehicle model type:', model);
    // Add your business logic here
  }

  handeleMakeChange(model: string) {
    this.selectedMake=model;
    console.log('Selected vehicle make type:', model);
  }

  generateYearOptions(): any[] {
    const currentYear = new Date().getFullYear();
    const startYear = 2022;
    const years = [];
    
    for (let year = currentYear + 1; year >= startYear; year--) {
      years.push({
        label: year.toString(),
        value: year.toString()
      });
    }
    
    return years;
  }

  handleYearChange(year: string): void {
    this.selectedYear = year;
    console.log('Selected YOM:', year);
    // Add your logic here
  }

  handleSelectChange(value: string) {
    this.selectedOption = value;
    console.log('Selected value:', value);
  }

  handleDateChange(event: any) {
    this.dateValue = event;
    console.log('Date changed:', event);
  }

  handleTimeChange(event: any) {
    this.timeValue = event.target.value;
    console.log(this.timeValue);
  }

  onTimeSelected(time: string) {
    console.log('Picked time:', time); // e.g. "10:45"
  }
}
