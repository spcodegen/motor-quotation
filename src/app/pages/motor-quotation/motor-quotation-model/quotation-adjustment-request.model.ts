export interface QuotationAdjustmentRequest {
  adjustmentId: string;
  rateId?: string;      // Optional for DROPDOWN adjustments
  amount?: number;      // Optional for INPUT_FIELD adjustments
}
