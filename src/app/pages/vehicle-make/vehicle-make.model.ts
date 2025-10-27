export interface VehicleMake {
  id: string;
  name: string;
  code: string;
  description: string;
  createdBy: string | null;
  createdDateTime: string;
  modifiedBy: string | null;
  modifiedDateTime: string;
  status: string;
  isDeleted: string;
}
