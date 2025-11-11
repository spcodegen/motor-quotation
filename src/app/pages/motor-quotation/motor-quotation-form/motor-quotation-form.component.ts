// motor-quotation-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { SelectComponent } from "../../../shared/components/form/select/select.component";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { RouterLink } from "@angular/router";

export interface Cover {
  coverName: string;
  coverType: 'textComponent' | 'dropdownComponent' | 'inputComponent';
  coverValueCanEdit: 'yes' | 'no';
  values: any;
  selectedValue?: any;
  processedOptions?: Option[];
}

export interface Product {
  productName: string;
  sumInsured: number;
  covers: Cover[];
}

export interface Option {
  value: string;
  label: string;
}

@Component({
  selector: 'app-motor-quotation-form',
  imports: [
    CommonModule,
    LabelComponent, 
    InputFieldComponent, 
    SelectComponent, 
    ComponentCardComponent, 
    ButtonComponent, 
    RouterLink
  ],
  templateUrl: './motor-quotation-form.component.html',
  styleUrl: './motor-quotation-form.component.css'
})
export class MotorQuotationFormComponent implements OnInit {

  message = '';
  selectedYear: string = '';
  selectedModel: string = '';
  selectedMake: string = '';
  // Generate years from 1950 to current year + 1
  yearOptions: any[] = this.generateYearOptions();
  
  showPassword = false;
  
  selectedOption = '';
  dateValue: any;
  timeValue = '';
  cardNumber = '';

  categoryOptions = [
    { value: 'car', label: 'Car' },
    { value: 'van', label: 'Van' },
    { value: 'bus', label: 'Bus' },
  ];
  modelOptions: any[] = [
    { label: 'Private', value: 'private' },
    { label: 'Hiring', value: 'hiring' },
    { label: 'Rent', value: 'rent' }
  ];
  productOption: any[] = [
    { label: 'Private', value: 'private' },
    { label: 'Hiring', value: 'hiring' },
    { label: 'Rent', value: 'rent' }
  ];

  // Product data
  product: Product | null = null;
  sumInsured: number = 5000000;

  constructor() {}

  ngOnInit(): void {
    this.loadProductData();
  }

  loadProductData(): void {
    // Simulate getting product data from service
    this.product = this.getRentCarProduct();
    this.preprocessCovers();
  }

  getRentCarProduct(): Product {
    return {
      productName: "Rent Car",
      sumInsured: 5000000,
      covers: [
        {
          coverName: "Basic Premium",
          coverType: "textComponent",
          coverValueCanEdit: "no",
          values: 1.38
        },
        {
          coverName: "Business Promotion Discount",
          coverType: "dropdownComponent",
          coverValueCanEdit: "yes",
          values: ['0%', '10%', '20%', '30%', '40%']
        },
        {
          coverName: "P.A.B.1",
          coverType: "inputComponent",
          coverValueCanEdit: "yes",
          values: 100000
        },
        {
          coverName: "W C I-Dri/Cle/Attd",
          coverType: "dropdownComponent",
          coverValueCanEdit: "yes",
          values: ['yes', 'no']
        },
        {
          coverName: "P.A.B.2",
          coverType: "inputComponent",
          coverValueCanEdit: "yes",
          values: 100000
        },
        {
          coverName: "Driving Tution Cover",
          coverType: "dropdownComponent",
          coverValueCanEdit: "yes",
          values: ['0%', '60%']
        },
        {
          coverName: "Driving Tution Cover 2",
          coverType: "dropdownComponent",
          coverValueCanEdit: "yes",
          values: ['0%', '60%']
        },
        {
          coverName: "Driving Tution Cover 3",
          coverType: "dropdownComponent",
          coverValueCanEdit: "no",
          values: ['0%', '60%']
        },
      ]
    };
  }

  preprocessCovers(): void {
    if (this.product && this.product.covers) {
      this.product.covers.forEach(cover => {
        if (cover.coverType === 'dropdownComponent') {
          cover.processedOptions = this.getDropdownOptions(cover);
        }
        // Set initial selected value for dropdowns
        if (cover.coverType === 'dropdownComponent' && !cover.selectedValue) {
          cover.selectedValue = this.getDefaultValue(cover);
        }
        // Set initial selected value for inputs
        if (cover.coverType === 'inputComponent' && !cover.selectedValue) {
          cover.selectedValue = this.getDefaultValue(cover);
        }
      });
    }
  }

  getDropdownOptions(cover: any): Option[] {
    if (Array.isArray(cover.values)) {
      return cover.values.map((v: any) => ({ label: v.toString(), value: v.toString() }));
    }
    return [{ label: cover.values.toString(), value: cover.values.toString() }];
  }

  handleModelChange(model: string): void {
    this.selectedModel = model;
    console.log('Selected vehicle model type:', model);
    // Add your business logic here
  }

  handeleMakeChange(model: string) {
    this.selectedMake = model;
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

  onCoverValueChange(cover: Cover, newValue: any): void {
    cover.selectedValue = newValue;
    console.log(`Cover ${cover.coverName} changed to:`, newValue);
    this.calculateTotalPremium();
  }

  getCoverDisplayValue(cover: Cover): string {
    if (cover.coverType === 'textComponent') {
      if (cover.coverName === 'Basic Premium') {
        const premium = (cover.values * this.sumInsured) / 100;
        return `${cover.values}% (${premium.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})`;
      }
      return cover.values.toString();
    }
    
    return cover.selectedValue || this.getDefaultValue(cover);
  }

  getDefaultValue(cover: Cover): any {
    if (Array.isArray(cover.values)) {
      return cover.values[0];
    }
    return cover.values;
  }

  isCoverEditable(cover: Cover): boolean {
    return cover.coverValueCanEdit === 'yes';
  }

  calculateTotalPremium(): number {
    if (!this.product) return 0;
    
    return this.product.covers.reduce((total: number, cover: Cover) => {
      if (cover.coverName === 'Basic Premium') {
        return total + (cover.values * this.sumInsured) / 100;
      }
      // Add calculations for other covers as needed
      return total;
    }, 0);
  }

  onSumInsuredChange(value: string): void {
    this.sumInsured = Number(value) || 0;
    this.calculateTotalPremium();
  }
}