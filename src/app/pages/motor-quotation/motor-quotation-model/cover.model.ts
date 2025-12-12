import { DisplayedAmountResponse } from "./displayed-amount-response.model";
import { RateResponse } from "./rate-response.model";
import { SeatResponse } from "./seat-response.model";

export interface Cover {
  id: string;
  name: string;
  code: string;
  description: string;
  orderNo: number;
  selectable: 'NO' | 'RATE' | 'AMOUNT'; // Added selectable field
  rateControlType: 'NOT_APPLICABLE' | 'INPUT_FIELD' | 'DROPDOWN';
  displayedAmountControlType: 'NOT_APPLICABLE' | 'INPUT_FIELD' | 'DROPDOWN';
  productResponse: any;
  rateResponseList: RateResponse[];
  seatResponseList: SeatResponse[];
  displayedAmountResponseList: DisplayedAmountResponse[];
  createdBy: string;
  createdDateTime: number;
  modifiedBy: string;
  modifiedByUser: string;
  modifiedDateTime: number;
  status: string;
  isDeleted: string;
}
