export interface VehicleMakeResponse {
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

export interface VehicleModel {
  id: string;
  name: string;
  code: string;
  description: string;
  vehicleMakeId: string;
  vehicleMakeResponse: VehicleMakeResponse;
  createdBy: string | null;
  createdDateTime: string;
  modifiedBy: string | null;
  modifiedDateTime: string;
  status: string;
  isDeleted: string;
}