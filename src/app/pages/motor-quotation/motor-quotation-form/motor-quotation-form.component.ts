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
import { QuotationAdjustmentRequest } from '../motor-quotation-model/quotation-adjustment-request.model';
import { Cover } from '../motor-quotation-model/cover.model';
import { SeatResponse } from '../motor-quotation-model/seat-response.model';
import { DisplayedAmountResponse } from '../motor-quotation-model/displayed-amount-response.model';

export interface CoverNew {
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
  covers: CoverNew[];
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
  // Adjustments data
  adjustments: Adjustment[] = [];
  selectedAdjustmentValues: { 
    [key: string]: { 
      rateId?: string, 
      value: number,
      amount?: number 
    } 
  } = {};
  // Covers data
  covers: Cover[] = [];
  selectedCoverValues: {
    [key: string]: {
      seatValue?: number;
      amountValue?: number;
      rateValue?: number;
      selectedSeatId?: string;
      selectedAmountId?: string;
      selectedRateId?: string;
    }
  } = {};
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

  // Update canCalculatePremium to include covers
  canCalculatePremium(): boolean {
    return !!this.selectedVehicleProduct && 
           !!this.sumInsured && 
           this.sumInsured !== '' && 
           (this.adjustments.length > 0 || this.covers.length > 0);
  }

  // Get selected rate ID for an adjustment
  getSelectedRateId(adjustmentId: string): string {
    return this.selectedAdjustmentValues[adjustmentId]?.rateId || '';
  }

  // Get placeholder based on adjustment type and input control
  getAdjustmentPlaceholder(adjustment: Adjustment): string {
    if (adjustment.inputControlType === 'DROPDOWN') {
      return adjustment.adjustmentType === 'LOADING' ? 'Select loading %' : 'Select discount %';
    } else {
      return adjustment.adjustmentType === 'LOADING' ? 'Enter amount (Rs.)' : 'Enter discount %';
    }
  }

  // Calculate premium with updated API structure
  calculatePremium() {
    if (!this.canCalculatePremium()) {
      console.warn('Cannot calculate premium: Missing required data');
      return;
    }

    this.isCalculating = true;
    this.premiumResult = null;

    // Prepare quotation adjustment request list
    const quotationAdjustmentRequestList: QuotationAdjustmentRequest[] = [];

    // Add each adjustment with its selected rate ID or amount
    this.adjustments.forEach(adjustment => {
      const selectedData = this.selectedAdjustmentValues[adjustment.id];
      if (selectedData) {
        const request: QuotationAdjustmentRequest = {
          adjustmentId: adjustment.id
        };

        if (adjustment.inputControlType === 'DROPDOWN' && selectedData.rateId) {
          // For DROPDOWN type, send rateId
          request.rateId = selectedData.rateId;
        } else if (adjustment.inputControlType === 'INPUT_FIELD') {
          // For INPUT_FIELD type, send amount (for LOADING) or value (for DISCOUNT as rate)
          if (adjustment.adjustmentType === 'LOADING') {
            request.amount = selectedData.value;
          } else {
            // For DISCOUNT INPUT_FIELD, we might need to send rateId or handle differently
            // Based on your API, it seems INPUT_FIELD discounts should send amount
            request.amount = selectedData.value;
          }
        }

        quotationAdjustmentRequestList.push(request);
      }
    });

    // Prepare request data
    const request: PremiumCalculationRequest = {
      productId: this.selectedVehicleProduct,
      quotationAdjustmentRequestList: quotationAdjustmentRequestList,
      sumInsured: this.parseSumInsured(this.sumInsured),
    };

    console.log('📊 Premium calculation request:', request);
    console.log('Request JSON:', JSON.stringify(request, null, 2));

    // Call API
    this.productService.calculateTotalPremium(request).subscribe({
      next: (response: PremiumCalculationResponse) => {
        this.premiumResult = response;
        this.isCalculating = false;
        console.log('✅ Premium calculation response:', response);
        console.log('💰 Basic Premium:', response.basicPremium);
        console.log('🛡️ Own Damage Premium:', response.ownDamagePremium);
        
        // Force UI update
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error calculating premium:', error);
        this.isCalculating = false;
        this.premiumResult = null;
        
        // Force UI update
        this.cdr.detectChanges();
      }
    });
  }

  // Parse sum insured string to number (remove commas)
  private parseSumInsured(sumInsured: string): number {
    const cleanValue = sumInsured.replace(/,/g, '');
    return parseFloat(cleanValue) || 0;
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
      label: `${rate.value}${rate.rateType === 'LOADING' ? '%' : '%'}`,
      value: rate.id // Store rate ID as value
    }));
  }

  // Get current adjustment value
  getAdjustmentValue(adjustmentId: string): number {
    return this.selectedAdjustmentValues[adjustmentId]?.value || 0;
  }

  // Handle adjustment input field change
  onAdjustmentInputChange(adjustmentId: string, event: any) {
    const value = parseFloat(event.target.value) || 0;
    const adjustment = this.adjustments.find(a => a.id === adjustmentId);
    
    // For INPUT_FIELD, store the entered value
    this.selectedAdjustmentValues[adjustmentId] = { 
      value: value,
      amount: value // Store amount for LOADING type
    };
    
    console.log(`Adjustment ${adjustmentId} input changed to:`, value, 
                adjustment?.adjustmentType === 'LOADING' ? 'Rs.' : '%');
    
    // Reset premium result when adjustments change
    this.premiumResult = null;
  }

  // Handle adjustment dropdown change
  onAdjustmentSelectChange(adjustmentId: string, selectedRateId: string) {
    const adjustment = this.adjustments.find(a => a.id === adjustmentId);
    
    if (adjustment && adjustment.rateResponseList) {
      // Find the selected rate to get the value
      const selectedRate = adjustment.rateResponseList.find(r => r.id === selectedRateId);
      const value = selectedRate ? selectedRate.value : 0;
      
      this.selectedAdjustmentValues[adjustmentId] = { 
        rateId: selectedRateId, 
        value: value 
      };
      console.log(`Adjustment ${adjustmentId} dropdown changed to:`, value, 
                  adjustment.adjustmentType === 'LOADING' ? 'Rs.' : '%', 
                  'Rate ID:', selectedRateId);
    }
    
    // Reset premium result when adjustments change
    this.premiumResult = null;
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
      
      // Check if adjustment object is valid
      if (!adjustment || !adjustment.id) {
        console.warn('❌ Invalid adjustment object:', adjustment);
        return;
      }
      
      if (adjustment.inputControlType === 'DROPDOWN') {
        // For DROPDOWN type, use first rate from rateResponseList
        if (adjustment.rateResponseList && adjustment.rateResponseList.length > 0) {
          // Filter out invalid rate responses and sort by orderNo
          const validRates = adjustment.rateResponseList
            .filter(rate => rate && typeof rate.value === 'number')
            .sort((a, b) => a.orderNo - b.orderNo);
          
          console.log('✅ Valid rates found:', validRates.length);
          
          if (validRates.length > 0) {
            // Use the first valid rate
            const selectedRate = validRates[0];
            this.selectedAdjustmentValues[adjustment.id] = {
              rateId: selectedRate.id,
              value: selectedRate.value
            };
            console.log(`🎯 Set DROPDOWN "${adjustment.name}" to:`, 
                       selectedRate.value, 
                       adjustment.adjustmentType === 'LOADING' ? 'Rs.' : '%',
                       'Rate ID:', selectedRate.id);
          } else {
            // No valid rate responses
            this.selectedAdjustmentValues[adjustment.id] = { value: 0 };
            console.warn(`⚠️ No valid rate responses for "${adjustment.name}"`);
          }
        } else {
          // No rate responses available
          this.selectedAdjustmentValues[adjustment.id] = { value: 0 };
          console.log(`ℹ️ No rate responses for "${adjustment.name}", set to 0`);
        }
      } else {
        // For INPUT_FIELD type, initialize to 0
        this.selectedAdjustmentValues[adjustment.id] = { value: 0 };
        console.log(`🎯 Set INPUT_FIELD "${adjustment.name}" to: 0`);
      }
    });
    
    console.log('🏁 FINAL selectedAdjustmentValues:', this.selectedAdjustmentValues);
    
    // Force change detection to update the view
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('🔄 Change detection triggered');
    });
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
      // Fetch covers when product is selected
      this.fetchAllActiveCovers();
    } else {
      this.adjustments = [];
      this.selectedAdjustmentValues = {};
      this.covers = [];
      this.selectedCoverValues = {};
    }
  }

  // Get covers sorted by orderNo
  getSortedCovers(): Cover[] {
    return this.covers.sort((a, b) => a.orderNo - b.orderNo);
  }

  // Get seat options
  getSeatOptions(seatResponseList: SeatResponse[]): Option[] {
    if (!seatResponseList || seatResponseList.length === 0) {
      return [];
    }
    
    // Sort seats by orderNo
    const sortedSeats = seatResponseList.sort((a, b) => a.orderNo - b.orderNo);
    
    return sortedSeats.map(seat => ({
      label: seat.value.toString(),
      value: seat.id
    }));
  }

  // Get amount options
  getAmountOptions(amountResponseList: DisplayedAmountResponse[]): Option[] {
    if (!amountResponseList || amountResponseList.length === 0) {
      return [];
    }
    
    // Sort amounts by orderNo
    const sortedAmounts = amountResponseList.sort((a, b) => a.orderNo - b.orderNo);
    
    return sortedAmounts.map(amount => ({
      label: amount.value.toString(),
      value: amount.id
    }));
  }

  // Get rate options
  getRateOptions(rateResponseList: RateResponse[]): Option[] {
    if (!rateResponseList || rateResponseList.length === 0) {
      return [];
    }
    
    // Sort rates by orderNo
    const sortedRates = rateResponseList.sort((a, b) => a.orderNo - b.orderNo);
    
    return sortedRates.map(rate => ({
      label: rate.value + '%',
      value: rate.id
    }));
  }

  // Get default amount from displayedAmountResponseList
  getDefaultAmount(cover: Cover): number {
    if (cover.displayedAmountResponseList && cover.displayedAmountResponseList.length > 0) {
      const sortedAmounts = cover.displayedAmountResponseList.sort((a, b) => a.orderNo - b.orderNo);
      return sortedAmounts[0].value;
    }
    return 0;
  }

  // Get default rate from rateResponseList
  getDefaultRate(cover: Cover): number {
    if (cover.rateResponseList && cover.rateResponseList.length > 0) {
      const sortedRates = cover.rateResponseList.sort((a, b) => a.orderNo - b.orderNo);
      return sortedRates[0].value;
    }
    return 0;
  }

  // Get selected seat value
  getSelectedSeatValue(coverId: string): string {
    return this.selectedCoverValues[coverId]?.selectedSeatId || '';
  }

  // Get cover amount
  getCoverAmount(coverId: string): number {
    return this.selectedCoverValues[coverId]?.amountValue || 0;
  }

  // Get cover rate
  getCoverRate(coverId: string): number {
    return this.selectedCoverValues[coverId]?.rateValue || 0;
  }

  // Handle seat change
  onSeatChange(coverId: string, seatId: string) {
    const cover = this.covers.find(c => c.id === coverId);
    if (cover && cover.seatResponseList) {
      const selectedSeat = cover.seatResponseList.find(s => s.id === seatId);
      if (selectedSeat) {
        if (!this.selectedCoverValues[coverId]) {
          this.selectedCoverValues[coverId] = {};
        }
        this.selectedCoverValues[coverId].selectedSeatId = seatId;
        this.selectedCoverValues[coverId].seatValue = selectedSeat.value;
        console.log(`Cover ${coverId} seat changed to:`, selectedSeat.value);
      }
    }
  }

  // Handle cover amount input change
  onCoverAmountChange(coverId: string, event: any) {
    const value = parseFloat(event.target.value) || 0;
    if (!this.selectedCoverValues[coverId]) {
      this.selectedCoverValues[coverId] = {};
    }
    this.selectedCoverValues[coverId].amountValue = value;
    console.log(`Cover ${coverId} amount changed to:`, value);
  }

  // Handle cover amount dropdown change
  onCoverAmountSelectChange(coverId: string, amountId: string) {
    const cover = this.covers.find(c => c.id === coverId);
    if (cover && cover.displayedAmountResponseList) {
      const selectedAmount = cover.displayedAmountResponseList.find(a => a.id === amountId);
      if (selectedAmount) {
        if (!this.selectedCoverValues[coverId]) {
          this.selectedCoverValues[coverId] = {};
        }
        this.selectedCoverValues[coverId].selectedAmountId = amountId;
        this.selectedCoverValues[coverId].amountValue = selectedAmount.value;
        console.log(`Cover ${coverId} amount changed to:`, selectedAmount.value);
      }
    }
  }

  // Handle cover rate input change
  onCoverRateChange(coverId: string, event: any) {
    const value = parseFloat(event.target.value) || 0;
    if (!this.selectedCoverValues[coverId]) {
      this.selectedCoverValues[coverId] = {};
    }
    this.selectedCoverValues[coverId].rateValue = value;
    console.log(`Cover ${coverId} rate changed to:`, value);
  }

  // Handle cover rate dropdown change
  onCoverRateSelectChange(coverId: string, rateId: string) {
    const cover = this.covers.find(c => c.id === coverId);
    if (cover && cover.rateResponseList) {
      const selectedRate = cover.rateResponseList.find(r => r.id === rateId);
      if (selectedRate) {
        if (!this.selectedCoverValues[coverId]) {
          this.selectedCoverValues[coverId] = {};
        }
        this.selectedCoverValues[coverId].selectedRateId = rateId;
        this.selectedCoverValues[coverId].rateValue = selectedRate.value;
        console.log(`Cover ${coverId} rate changed to:`, selectedRate.value);
      }
    }
  }

  // Initialize cover values
  initializeCoverValues() {
    console.log('🚀 START: initializeCoverValues');
    this.selectedCoverValues = {};
    
    if (!this.covers || this.covers.length === 0) {
      console.warn('❌ No covers available to initialize');
      return;
    }
    
    // Sort covers by orderNo before initializing
    const sortedCovers = this.getSortedCovers();
    
    sortedCovers.forEach((cover, index) => {
      console.log(`\n📋 Processing cover ${index + 1}:`, cover.name);
      console.log('Cover ID:', cover.id);
      console.log('Order No:', cover.orderNo);
      console.log('Rate Control Type:', cover.rateControlType);
      console.log('Displayed Amount Control Type:', cover.displayedAmountControlType);
      
      // Initialize cover values object
      this.selectedCoverValues[cover.id] = {};
      
      // Initialize seat value if available
      if (cover.seatResponseList && cover.seatResponseList.length > 0) {
        const sortedSeats = cover.seatResponseList.sort((a, b) => a.orderNo - b.orderNo);
        const defaultSeat = sortedSeats[0];
        this.selectedCoverValues[cover.id].selectedSeatId = defaultSeat.id;
        this.selectedCoverValues[cover.id].seatValue = defaultSeat.value;
        console.log(`🎯 Set seat for "${cover.name}" to:`, defaultSeat.value);
      }
      
      // Initialize amount value based on control type
      if (cover.displayedAmountControlType === 'DROPDOWN' && 
          cover.displayedAmountResponseList && 
          cover.displayedAmountResponseList.length > 0) {
        const sortedAmounts = cover.displayedAmountResponseList.sort((a, b) => a.orderNo - b.orderNo);
        const defaultAmount = sortedAmounts[0];
        this.selectedCoverValues[cover.id].selectedAmountId = defaultAmount.id;
        this.selectedCoverValues[cover.id].amountValue = defaultAmount.value;
        console.log(`🎯 Set amount (DROPDOWN) for "${cover.name}" to:`, defaultAmount.value);
      } else if (cover.displayedAmountControlType === 'INPUT_FIELD') {
        // For INPUT_FIELD, set to 0 initially
        this.selectedCoverValues[cover.id].amountValue = 0;
        console.log(`🎯 Set amount (INPUT_FIELD) for "${cover.name}" to: 0`);
      } else if (cover.displayedAmountControlType === 'NOT_APPLICABLE' && 
                 cover.displayedAmountResponseList && 
                 cover.displayedAmountResponseList.length > 0) {
        // Store default amount even if NOT_APPLICABLE
        const sortedAmounts = cover.displayedAmountResponseList.sort((a, b) => a.orderNo - b.orderNo);
        const defaultAmount = sortedAmounts[0];
        this.selectedCoverValues[cover.id].amountValue = defaultAmount.value;
        console.log(`🎯 Set default amount for "${cover.name}" to:`, defaultAmount.value);
      }
      
      // Initialize rate value based on control type
      if (cover.rateControlType === 'DROPDOWN' && 
          cover.rateResponseList && 
          cover.rateResponseList.length > 0) {
        const sortedRates = cover.rateResponseList.sort((a, b) => a.orderNo - b.orderNo);
        const defaultRate = sortedRates[0];
        this.selectedCoverValues[cover.id].selectedRateId = defaultRate.id;
        this.selectedCoverValues[cover.id].rateValue = defaultRate.value;
        console.log(`🎯 Set rate (DROPDOWN) for "${cover.name}" to:`, defaultRate.value, '%');
      } else if (cover.rateControlType === 'INPUT_FIELD') {
        // For INPUT_FIELD, set to 0 initially
        this.selectedCoverValues[cover.id].rateValue = 0;
        console.log(`🎯 Set rate (INPUT_FIELD) for "${cover.name}" to: 0%`);
      } else if (cover.rateControlType === 'NOT_APPLICABLE' && 
                 cover.rateResponseList && 
                 cover.rateResponseList.length > 0) {
        // Store default rate even if NOT_APPLICABLE
        const sortedRates = cover.rateResponseList.sort((a, b) => a.orderNo - b.orderNo);
        const defaultRate = sortedRates[0];
        this.selectedCoverValues[cover.id].rateValue = defaultRate.value;
        console.log(`🎯 Set default rate for "${cover.name}" to:`, defaultRate.value, '%');
      }
    });
    
    console.log('🏁 FINAL selectedCoverValues:', this.selectedCoverValues);
    
    // Force change detection
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('🔄 Change detection triggered for covers');
    });
  }

  // Fetch all active covers
  fetchAllActiveCovers() {
    console.log('📡 Fetching all active covers...');
    this.productService.getAllActiveCovers().subscribe({
      next: (data: Cover[]) => {
        // Filter covers for the selected product
        const filteredCovers = data.filter(cover => 
          cover.productResponse && cover.productResponse.id === this.selectedVehicleProduct
        );
        
        console.log('✅ Covers API response (filtered):', filteredCovers);
        this.covers = filteredCovers;
        
        // Initialize values after a small delay
        setTimeout(() => {
          console.log('⏰ Initializing cover values after timeout...');
          this.initializeCoverValues();
        }, 100);
      },
      error: (error) => {
        console.error('❌ Error fetching covers:', error);
        this.covers = [];
        this.selectedCoverValues = {};
      }
    });
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

  getDefaultValue(cover: CoverNew): any {
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

  onCoverValueChange(cover: CoverNew, newValue: any): void {
    cover.selectedValue = newValue;
    console.log(`Cover ${cover.coverName} changed to:`, newValue);
    this.calculateTotalPremium();
  }

  getCoverDisplayValue(cover: CoverNew): string {
    if (cover.coverType === 'textComponent') {
      if (cover.coverName === 'Basic Premium') {
        const premium = (cover.values * this.sumInsuredNew) / 100;
        return `${cover.values}% (${premium.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})`;
      }
      return cover.values.toString();
    }
    
    return cover.selectedValue || this.getDefaultValue(cover);
  }

  isCoverEditable(cover: CoverNew): boolean {
    return cover.coverValueCanEdit === 'yes';
  }

  calculateTotalPremium(): number {
    if (!this.product) return 0;
    
    return this.product.covers.reduce((total: number, cover: CoverNew) => {
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