import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehicleMake } from './vehicle-make.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleMakeService {
  private baseUrl = 'http://172.21.112.154:8080';

  constructor(private http: HttpClient) { }
  

 // Get all active vehicle makes
  fetchVehicleMakes(): Observable<VehicleMake[]> {
    return this.http.get<VehicleMake[]>(`${this.baseUrl}/vehicleMake/getAllActive`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get vehicle make by ID
  getVehicleMakeById(id: string): Observable<VehicleMake> {
    return this.http.get<VehicleMake>(`${this.baseUrl}/vehicleMake/getById/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

   // Create new vehicle make
  createVehicleMake(vehicleMake: VehicleMake): Observable<VehicleMake> {
    return this.http.post<VehicleMake>(`${this.baseUrl}/vehicleMake/save`, vehicleMake)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update vehicle make
  updateVehicleMake(vehicleMake: VehicleMake): Observable<VehicleMake> {
    return this.http.put<VehicleMake>(`${this.baseUrl}/vehicleMake/update`, vehicleMake)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete vehicle make (soft delete)
  deleteVehicleMake(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/vehicleMake/delete/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add other methods for different endpoints
  fetchVehicleModels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/vehicleModel/getAllActive`)
      .pipe(
        catchError(this.handleError)
      );
  }


  // Common error handler
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
