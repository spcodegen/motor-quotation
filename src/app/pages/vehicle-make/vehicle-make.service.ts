import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehicleMake } from './vehicle-make.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleMakeService {
  private apiUrl='http://172.21.112.154:8080/vehicleMake/getAllActive';

  constructor(private http: HttpClient) { }

 getAllActiveVehicleMakes(): Observable<VehicleMake[]> {
    return this.http.get<VehicleMake[]>(this.apiUrl);
  }
}
