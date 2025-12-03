import { QuotationAdjustmentRequest } from "./quotation-adjustment-request.model";

export interface PremiumCalculationRequest {
  productId: string;
  quotationAdjustmentRequestList: QuotationAdjustmentRequest[];
  sumInsured: number;
}
