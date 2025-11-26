// motor-quotation-form.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { SelectComponent } from "../../../shared/components/form/select/select.component";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../product.service';
import { VehicleType } from '../motor-quotation-model/vehicle-type.model';
import { VehicleProduct } from '../motor-quotation-model/vehicle-product.model';
import { Adjustment, RateResponse } from '../motor-quotation-model/rate-response.model';
import { PremiumCalculationResponse } from '../motor-quotation-model/premium-calculation-response.mode';
import { PremiumCalculationRequest } from '../motor-quotation-model/premium-calculation-request.mode';
// import { Discount, RateResponse } from '../motor-quotation-model/rate-response.model';


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

interface DiscountOption {
  label: string;
  value: number;
}


@Component({
  selector: 'app-motor-quotation-form',
  imports: [
    CommonModule,
    LabelComponent,
    InputFieldComponent,
    SelectComponent,
    ComponentCardComponent
],
  templateUrl: './motor-quotation-form.component.html',
  styleUrl: './motor-quotation-form.component.css'
})
export class MotorQuotationFormComponent implements OnInit {

  // Options for dropdowns
  categoryOptions: Option[] = [];
  makeOptions: Option[] = [];
  modelOptions:Option[] = [];
  chassisOptions:Option[] = [];
  yearOptions: Option[] = [];
  vehicleTypeOptions: Option[] = [];
  vehicleProductOptions: Option[] = [];
  // Selected values
  selectedCategory:string = '';
  selectedMake:string = '';
  selectedModel:string = '';
  selectedChassis:string = '';
  selectedYear:string = '';
  sumInsured: string = '';
  selectedVehicleType: string = '';
  selectedVehicleProduct: string = '';

  // Adjustments data (replaces discounts)
  adjustments: Adjustment[] = [];
  selectedAdjustmentValues: { [key: string]: number } = {};

  // Premium calculation
  premiumResult: PremiumCalculationResponse | null = null;
  isCalculating: boolean = false;

  // Adjustment mappings for API
  private adjustmentMappings = {
    'Riya Sumithuru Discount': 'rsdRate',
    'Business Promotion Discount': 'businessPromotionDiscountRate',
    'Hire Purchase Leasing': 'hpLeasingRate',
    'Multiple Rebate': 'multipleRebateRate'
  };

  message = '';
  showPassword = false;
  selectedOption = '';
  dateValue: any;
  timeValue = '';
  cardNumber = '';
  productOption: any[] = [
    { label: 'Private', value: 'private' },
    { label: 'Hiring', value: 'hiring' },
    { label: 'Rent', value: 'rent' }
  ];
  // Product data
  product: Product | null = null;
  sumInsuredNew: number = 5000000;
  basicPremium: number = 50000;

  constructor(private http: HttpClient, private productService: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchVehicleCategories();
    this.fetchVehicleTypes();
  }

  // Check if premium can be calculated
  canCalculatePremium(): boolean {
    return !!this.selectedVehicleProduct && 
           !!this.sumInsured && 
           this.sumInsured !== '' && 
           this.adjustments.length > 0;
  }

  // Calculate premium
  // In the component class, update the calculatePremium method
calculatePremium() {
  if (!this.canCalculatePremium()) {
    console.warn('Cannot calculate premium: Missing required data');
    return;
  }

  this.isCalculating = true;
  this.premiumResult = null;

  // Prepare request data
  const request: PremiumCalculationRequest = {
    productId: this.selectedVehicleProduct,
    sumInsured: this.parseSumInsured(this.sumInsured),
    rsdRate: 0,
    businessPromotionDiscountRate: 0,
    hpLeasingRate: 0,
    multipleRebateRate: 0,
  };

  // Map adjustment values to request - FIXED VERSION
  this.adjustments.forEach(adjustment => {
    const mappingKey = adjustment.name as keyof typeof this.adjustmentMappings;
    const adjustmentKey = this.adjustmentMappings[mappingKey];
    
    if (adjustmentKey) {
      // Use type assertion to fix the TypeScript error
      (request as any)[adjustmentKey] = this.getAdjustmentValue(adjustment.id);
    }
  });

  console.log('📊 Premium calculation request:', request);

  // Call API
  this.productService.calculateTotalPremium(request).subscribe({
    next: (response: PremiumCalculationResponse) => {
      this.premiumResult = response;
      this.isCalculating = false;
      console.log('✅ Premium calculation response:', response);
      console.log('💰 Own Damage Premium:', response.ownDamagePremium);
      
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('❌ Error calculating premium:', error);
      this.isCalculating = false;
      this.premiumResult = null;
      this.cdr.detectChanges();
    }
  });
}

  // Parse sum insured string to number (remove commas)
  private parseSumInsured(sumInsured: string): number {
    const cleanValue = sumInsured.replace(/,/g, '');
    return parseFloat(cleanValue) || 0;
  }

  // Fetch initial vehicle categories
  fetchVehicleCategories() {
    this.productService.getVehicleCategories().subscribe({
      next: (data) => {
        this.categoryOptions = data.map(item => ({
          label: item,
          value: item
        }));
      },
      error: (error) => {
        console.error('Error fetching vehicle categories:', error);
      }
    });
  }

  // Fetch vehicle makes based on selected category
  fetchVehicleMakes(category: string) {
    this.productService.getVehicleMakes(category).subscribe({
      next: (data) => {
        this.makeOptions = data.map(item => ({
          label: item,
          value: item
        }));
      },
      error: (error) => {
        console.error('Error fetching vehicle makes:', error);
        this.makeOptions = [];
      }
    });
  }

  // Fetch vehicle models based on selected category and make
  fetchVehicleModels(category: string, make: string) {
    this.productService.getVehicleModels(category, make).subscribe({
      next: (data) => {
        this.modelOptions = data.map(item => ({
          label: item,
          value: item
        }));
      },
      error: (error) => {
        console.error('Error fetching vehicle models:', error);
        this.modelOptions = [];
      }
    });
  }

  // Fetch vehicle chassis based on selected category, make and model
  fetchVehicleChassis(category: string, make: string, model: string) {
    this.productService.getVehicleChassis(category, make, model).subscribe({
      next: (data) => {
        this.chassisOptions = data.map(item => ({
          label: item,
          value: item
        }));
      },
      error: (error) => {
        console.error('Error fetching vehicle chassis:', error);
        this.chassisOptions = [];
      }
    });
  }

  // Fetch vehicle years based on selected category, make, model and chassis
  fetchVehicleYears(category: string, make: string, model: string, chassis: string) {
    this.productService.getVehicleYears(category, make, model, chassis).subscribe({
      next: (data) => {
        this.yearOptions = data.map(item => ({
          label: item,
          value: item
        }));
      },
      error: (error) => {
        console.error('Error fetching vehicle years:', error);
        this.yearOptions = [];
      }
    });
  }

  // Fetch vehicle value based on all selected parameters
  fetchVehicleValue(category: string, chassis: string, make: string, model: string,  year: string) {
    this.productService.getVehicleValue(category, chassis, make, model,  year).subscribe({
      next: (data) => {
        console.log('Vehicle value response:', data);
        this.sumInsured = data.trim();
      },
      error: (error) => {
        console.error('Error fetching vehicle value:', error);
        this.sumInsured = '';
      }
    });
  }

  // Fetch vehicle types
  fetchVehicleTypes() {
    this.productService.getVehicleTypes().subscribe({
      next: (data: VehicleType[]) => {
        this.vehicleTypeOptions = data.map(item => ({
          label: item.name,  // Use 'name' for display
          value: item.id     // Use 'id' for value (or use item.name if you prefer)
        }));
      },
      error: (error) => {
        console.error('Error fetching vehicle types:', error);
      }
    });
  }

   // Fetch vehicle products by vehicle type ID
  fetchVehicleProducts(vehicleTypeId: string) {
    this.productService.getVehicleProductsByType(vehicleTypeId).subscribe({
      next: (data: VehicleProduct[]) => {
        this.vehicleProductOptions = data.map(item => ({
          label: item.name,
          value: item.id
        }));
      },
      error: (error) => {
        console.error('Error fetching vehicle products:', error);
        this.vehicleProductOptions = [];
      }
    });
  }

  // Fetch all active adjustments
  fetchAllActiveAdjustments() {
    console.log('📡 Fetching all active adjustments...');
    this.productService.getAllActiveAdjustments().subscribe({
      next: (data: Adjustment[]) => {
        console.log('✅ Adjustments API response:', data);
        this.adjustments = data;
        
        // Initialize values after a small delay to ensure data is set
        setTimeout(() => {
          console.log('⏰ Initializing adjustment values after timeout...');
          this.initializeAdjustmentValues();
        }, 100);
      },
      error: (error) => {
        console.error('❌ Error fetching adjustments:', error);
        this.adjustments = [];
        this.selectedAdjustmentValues = {};
      }
    });
  }

  // Handle category selection change
  handleCategoryChange(category: string) {
    this.selectedCategory = category;    
    this.selectedMake = '';
    this.selectedModel = '';
    this.selectedChassis = '';
    this.selectedYear = '';
    this.sumInsured = '';
    this.makeOptions = [];
    this.modelOptions = [];
    this.chassisOptions = [];
    this.yearOptions = [];
    if (category) {
      this.fetchVehicleMakes(category);
    }
  }
  // Handle make selection change
  handleMakeChange(make:string){
    this.selectedMake = make;
    this.selectedModel = '';
    this.selectedChassis = '';
    this.selectedYear = '';
    this.sumInsured = '';
    this.modelOptions = [];
    this.chassisOptions = [];

    if (make && this.selectedCategory) {
      this.fetchVehicleModels(this.selectedCategory, make);
    }
  }
  // Handle model selection change
  handleModelChange(model:string){
    this.selectedModel=model;
    this.selectedChassis = '';
    this.selectedYear = '';
    this.sumInsured = '';
    this.chassisOptions = [];
    this.yearOptions = [];

    if (model && this.selectedCategory && this.selectedMake) {
      this.fetchVehicleChassis(this.selectedCategory, this.selectedMake, model)
    }
  }
  // Handle chassis selection change
  handleChassisChange(chassis:string){
    this.selectedChassis = chassis;
    this.selectedYear = '';
    this.sumInsured = '';
    this.yearOptions = [];

    if (chassis && this.selectedCategory && this.selectedMake && this.selectedModel) {
      this.fetchVehicleYears(this.selectedCategory, this.selectedMake, this.selectedModel, chassis);
    }
  }
  // Handle year selection change
  handleYearChange(year:string){
    this.selectedYear = year;
    this.sumInsured = '';

    if (year && this.selectedCategory && this.selectedMake && this.selectedModel && this.selectedChassis) {
      this.fetchVehicleValue(this.selectedCategory, this.selectedChassis, this.selectedMake, this.selectedModel, year);
    }
  }
  // Handle vehicle type selection change
  handleVehicleTypeChange(vehicleTypeId: string) {
    this.selectedVehicleType = vehicleTypeId;
    this.selectedVehicleProduct = '';
    this.vehicleProductOptions = [];

    console.log('Selected vehicle type:', vehicleTypeId);

    if (vehicleTypeId) {
      this.fetchVehicleProducts(vehicleTypeId);
    }
  }

  // Handle vehicle product selection change
  handleVehicleProductChange(productId: string) {
    this.selectedVehicleProduct = productId;
    console.log('🚗 Vehicle product selected:', productId);
     if (productId) {
       // Fetch adjustments when product is selected
      this.fetchAllActiveAdjustments();
      // this.loadProductData();
    } else {
      this.adjustments = [];
      this.selectedAdjustmentValues = {};
    }
  }

  // Initialize adjustment values
  initializeAdjustmentValues() {
    console.log('🚀 START: initializeAdjustmentValues');
    this.selectedAdjustmentValues = {};
    
    if (!this.adjustments || this.adjustments.length === 0) {
      console.warn('❌ No adjustments available to initialize');
      return;
    }
    
    // Sort adjustments by orderNo before initializing
    const sortedAdjustments = this.getSortedAdjustments();
    
    sortedAdjustments.forEach((adjustment, index) => {
      console.log(`\n📋 Processing adjustment ${index + 1}:`, adjustment.name);
      console.log('Adjustment ID:', adjustment.id);
      console.log('Order No:', adjustment.orderNo);
      console.log('Adjustment Type:', adjustment.adjustmentType);
      console.log('Input Control Type:', adjustment.inputControlType);
      console.log('Rate Response List:', adjustment.rateResponseList);
      
      // Check if adjustment object is valid
      if (!adjustment || !adjustment.id) {
        console.warn('❌ Invalid adjustment object:', adjustment);
        return;
      }
      
      // Check if rateResponseList exists and has items
      if (adjustment.rateResponseList && adjustment.rateResponseList.length > 0) {
        // Filter out invalid rate responses and sort by orderNo
        const validRates = adjustment.rateResponseList
          .filter(rate => rate && typeof rate.value === 'number')
          .sort((a, b) => a.orderNo - b.orderNo);
        
        console.log('✅ Valid rates found:', validRates.length);
        
        if (validRates.length > 0) {
          // Use the first valid rate value (lowest orderNo)
          const selectedValue = validRates[0].value;
          this.selectedAdjustmentValues[adjustment.id] = selectedValue;
          console.log(`🎯 Set ${adjustment.inputControlType} "${adjustment.name}" to:`, selectedValue);
        } else {
          // No valid rate responses
          this.selectedAdjustmentValues[adjustment.id] = 0;
          console.warn(`⚠️ No valid rate responses for "${adjustment.name}"`);
        }
      } else {
        // No rate responses available
        this.selectedAdjustmentValues[adjustment.id] = 0;
        console.log(`ℹ️ No rate responses for "${adjustment.name}", set to 0`);
      }
    });
    
    console.log('🏁 FINAL selectedAdjustmentValues:', this.selectedAdjustmentValues);
    
    // Force change detection to update the view
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('🔄 Change detection triggered');
    });
  }


  // Get adjustments sorted by orderNo
  getSortedAdjustments(): Adjustment[] {
    return this.adjustments.sort((a, b) => a.orderNo - b.orderNo);
  }

  // Get adjustment options for dropdown
  getAdjustmentOptions(rateResponseList: RateResponse[]): Option[] {
    if (!rateResponseList || rateResponseList.length === 0) {
      return [];
    }
    
    // Sort rate responses by orderNo
    const sortedRates = rateResponseList.sort((a, b) => a.orderNo - b.orderNo);
    
    return sortedRates.map(rate => ({
      label: `${rate.value}%`,
      value: rate.value.toString()
    }));
  }

  // Get placeholder based on adjustment type
  getAdjustmentPlaceholder(adjustmentType: string): string {
    return adjustmentType === 'LOADING' ? 'Select loading %' : 'Select discount %';
  }

  // Get current adjustment value
  getAdjustmentValue(adjustmentId: string): number {
    return this.selectedAdjustmentValues[adjustmentId] || 0;
  }

  // Handle adjustment input field change
  onAdjustmentInputChange(adjustmentId: string, event: any) {
    const value = parseFloat(event.target.value) || 0;
    this.selectedAdjustmentValues[adjustmentId] = value;
    console.log(`Adjustment ${adjustmentId} input changed to:`, value);
  }

  // Handle adjustment dropdown change
  onAdjustmentSelectChange(adjustmentId: string, value: string) {
    const numericValue = parseFloat(value) || 0;
    this.selectedAdjustmentValues[adjustmentId] = numericValue;
    console.log(`Adjustment ${adjustmentId} dropdown changed to:`, numericValue);
  }

  ///////////////////////////////////////////////////
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

  getDefaultValue(cover: Cover): any {
    if (Array.isArray(cover.values)) {
      return cover.values[0];
    }
    return cover.values;
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
        const premium = (cover.values * this.sumInsuredNew) / 100;
        return `${cover.values}% (${premium.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})`;
      }
      return cover.values.toString();
    }
    
    return cover.selectedValue || this.getDefaultValue(cover);
  }

  isCoverEditable(cover: Cover): boolean {
    return cover.coverValueCanEdit === 'yes';
  }

  calculateTotalPremium(): number {
    if (!this.product) return 0;
    
    return this.product.covers.reduce((total: number, cover: Cover) => {
      if (cover.coverName === 'Basic Premium') {
        return total + (cover.values * this.sumInsuredNew) / 100;
      }
      // Add calculations for other covers as needed
      return total;
    }, 0);
  }

  onSumInsuredChange(value: string): void {
    this.sumInsuredNew = Number(value) || 0;
    this.calculateTotalPremium();
  }
}