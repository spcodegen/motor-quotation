// services/product.service.ts
import { Injectable } from '@angular/core';
import { Product, Cover } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getRentCarProduct(): Product {
    return {
      productName: "Rent Car",
      sumInsured: 5000000,
      covers: [
        {
          coverName: "Basic Premium",
          coverType: "textComponent",
          coverValueCanEdit: "no",
          values: 1.38
        },
        {
          coverName: "Business Promotion Discount",
          coverType: "dropdownComponent",
          coverValueCanEdit: "yes",
          values: ['0%', '10%', '20%', '30%', '40%']
        },
        {
          coverName: "P.A.B.1",
          coverType: "inputComponent",
          coverValueCanEdit: "yes",
          values: 100000
        },
        {
          coverName: "W C I-Dri/Cle/Attd",
          coverType: "dropdownComponent",
          coverValueCanEdit: "yes",
          values: ['yes', 'no']
        },
        {
          coverName: "P.A.B.2",
          coverType: "inputComponent",
          coverValueCanEdit: "yes",
          values: 100000
        },
        {
          coverName: "Driving Tution Cover",
          coverType: "dropdownComponent",
          coverValueCanEdit: "yes",
          values: ['0%', '60%']
        }
      ]
    };
  }
}