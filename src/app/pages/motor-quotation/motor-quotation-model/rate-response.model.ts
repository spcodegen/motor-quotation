export interface RateResponse {
  id: string;
  name: string;
  value: number;
  orderNo: number;
  rateType: string;
  discountId: string;
  loadingId: any;
  coverId: any;
  createdBy: string;
  createdDateTime: number;
  modifiedBy: string;
  modifiedDateTime: number;
  status: string;
  isDeleted: string;
}

export interface Discount {
  id: string;
  name: string;
  code: string;
  description: string;
  inputControlType: 'INPUT_FIELD' | 'DROPDOWN';
  rateResponseList: RateResponse[];
  createdBy: string;
  createdDateTime: number;
  modifiedBy: string;
  modifiedDateTime: number;
  status: string;
  isDeleted: string;
}

