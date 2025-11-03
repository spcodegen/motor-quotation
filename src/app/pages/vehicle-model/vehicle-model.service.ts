import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleModel } from './vehicle-model.model';



@Injectable({
  providedIn: 'root'
})
export class VehicleModelService {
  private apiUrl = 'http://172.21.112.154:8080/vehicleModel';

  constructor(private http: HttpClient) { }

  getAllActiveVehicleModels(): Observable<VehicleModel[]> {
    return this.http.get<VehicleModel[]>(`${this.apiUrl}/getAllActive`);
  }

  getVehicleModelById(id: string): Observable<VehicleModel> {
    return this.http.get<VehicleModel>(`${this.apiUrl}/getById/${id}`);
  }

  createVehicleModel(vehicleModel: Partial<VehicleModel>): Observable<VehicleModel> {
    return this.http.post<VehicleModel>(`${this.apiUrl}/create`, vehicleModel);
  }

  updateVehicleModel(id: string, vehicleModel: Partial<VehicleModel>): Observable<VehicleModel> {
    return this.http.put<VehicleModel>(`${this.apiUrl}/update/${id}`, vehicleModel);
  }

  deleteVehicleModel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getModelsByMake(vehicleMakeId: string): Observable<VehicleModel[]> {
    return this.http.get<VehicleModel[]>(`${this.apiUrl}/getByMake/${vehicleMakeId}`);
  }
}