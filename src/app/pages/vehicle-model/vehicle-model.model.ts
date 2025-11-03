export interface VehicleMakeResponse {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface VehicleModel {
  id: string;
  name: string;
  code: string;
  description: string;
  vehicleMakeId: string;
  vehicleMakeResponse: VehicleMakeResponse;
}