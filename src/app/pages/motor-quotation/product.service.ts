// services/product.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  // Fetch vehicle categories
  getVehicleCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Quotation/VehicleCategory`);
  }
  // Fetch vehicle makes based on category
  getVehicleMakes(category: string): Observable<string[]> {
    const url = `${this.apiUrl}/Quotation/VehicleMake?category=${encodeURIComponent(category)}`;
    return this.http.get<string[]>(url);
  }

  // Fetch vehicle models based on category and make
  getVehicleModels(category: string, make: string): Observable<string[]> {
    const url = `${this.apiUrl}/Quotation/VehicleModel?category=${encodeURIComponent(category)}&make=${encodeURIComponent(make)}`;
    return this.http.get<string[]>(url);
  }

  // Fetch vehicle chassis based on category, make and model
  getVehicleChassis(category: string, make: string, model: string): Observable<string[]> {
    const url = `${this.apiUrl}/Quotation/VehicleChassis?category=${encodeURIComponent(category)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;
    return this.http.get<string[]>(url);
  }

  // Fetch vehicle years based on category, make, model and chassis
  getVehicleYears(category: string, make: string, model: string, chassis: string): Observable<string[]> {
    const url = `${this.apiUrl}/Quotation/VehicleYear?category=${encodeURIComponent(category)}&chassis=${encodeURIComponent(chassis)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;
    return this.http.get<string[]>(url);
  }

  // Fetch vehicle value based on all selected parameters
  getVehicleValue(category: string, chassis: string, make: string, model: string,  year: string): Observable<string> {
    const url = `${this.apiUrl}/Quotation/VehicleValue?category=${encodeURIComponent(category)}&chassis=${encodeURIComponent(chassis)}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`;
    return this.http.get(url, { responseType: 'text' });
  }
}