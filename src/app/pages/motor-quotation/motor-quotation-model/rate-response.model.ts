export interface RateResponse {
  id: string;
  name: string;
  value: number;
  orderNo: number;
  rateType: string;
  adjustmentId: string;
  coverId: any;
  createdBy: string;
  createdDateTime: number;
  modifiedBy: string;
  modifiedDateTime: number;
  status: string;
  isDeleted: string;
}

export interface Adjustment {
  id: string;
  name: string;
  code: string;
  description: string;
  orderNo: number;
  adjustmentType: 'DISCOUNT' | 'LOADING';
  inputControlType: 'INPUT_FIELD' | 'DROPDOWN';
  rateResponseList: RateResponse[];
  createdBy: string;
  createdDateTime: number;
  modifiedBy: string;
  modifiedDateTime: number;
  status: string;
  isDeleted: string;
}

