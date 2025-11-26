export interface PremiumCalculationResponse {
  id: string | null;
  quotationNo: string | null;
  basicPremium: number;
  basicRate: number;
  ownDamagePremium: number;
  coverResponseList: any | null;
  createdBy: string | null;
  createdDateTime: number | null;
  modifiedBy: string | null;
  modifiedDateTime: number | null;
  status: string | null;
  isDeleted: string | null;
}
