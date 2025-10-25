import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../../ui/button/button.component';
import { TableDropdownComponent } from '../../../common/table-dropdown/table-dropdown.component';
import { BadgeComponent } from '../../../ui/badge/badge.component';
import { RouterLink } from "@angular/router";

interface Transaction {
  image: string;
  name: string;
  code: string;
  description: string;
  edit: string;
  // delete: "Success" | "Pending" | "Failed";
  delete: string;
}

@Component({
  selector: 'app-basic-table-three',
  imports: [
    CommonModule,
    ButtonComponent,
    RouterLink
],
  templateUrl: './basic-table-three.component.html',
  styles: ``
})
export class BasicTableThreeComponent {

  // Type definition for the transaction data


  transactionData: Transaction[] = [
    {
      image: "/images/icons/edit.svg", // Path or URL for the image
      name: "NISSAN", // Action description
      code: "NSS", // Date and time of the transaction
      description: "NSS", // Transaction amount
      edit: "/images/icons/edit.svg", // Category of the transaction
      delete: "/images/icons/delete.svg",
    },
    {
      image: "/images/icons/edit.svg", // Path or URL for the image
      name: "TOYOTA", // Action description
      code: "TOY", // Date and time of the transaction
      description: "Toyota Toyota Toyota", // Transaction amount
      edit: "/images/icons/edit.svg", // Category of the transaction
      delete: "/images/icons/delete.svg",
    },
    {
      image: "/images/icons/edit.svg", // Path or URL for the image
      name: "HONDA", // Action description
      code: "HND", // Date and time of the transaction
      description: "HND", // Transaction amount
      edit: "/images/icons/edit.svg", // Category of the transaction
      delete: "/images/icons/delete.svg",
    },
    {
      image: "/images/icons/edit.svg", // Path or URL for the image
      name: "SUZUKI", // Action description
      code: "SZK", // Date and time of the transaction
      description: "SZK", // Transaction amount
      edit: "/images/icons/edit.svg", // Category of the transaction
      delete: "/images/icons/delete.svg",
    },
    {
      image: "/images/icons/edit.svg", // Path or URL for the image
      name: "KIA", // Action description
      code: "KIA", // Date and time of the transaction
      description: "KIA", // Transaction amount
      edit: "/images/icons/edit.svg", // Category of the transaction
      delete: "/images/icons/delete.svg",
    },
    {
      image: "/images/icons/edit.svg", // Path or URL for the image
      name: "MITSUBISHI", // Action description
      code: "MBS", // Date and time of the transaction
      description: "MITSUBISHI", // Transaction amount
      edit: "/images/icons/edit.svg", // Category of the transaction
      delete: "/images/icons/delete.svg",
    },
    {
      image: "/images/icons/edit.svg", // Path or URL for the image
      name: "PERODUA", // Action description
      code: "PRD", // Date and time of the transaction
      description: "PRD", // Transaction amount
      edit: "/images/icons/edit.svg", // Category of the transaction
      delete: "/images/icons/delete.svg",
    },
    {
      image: "/images/icons/edit.svg", // Path or URL for the image
      name: "DFSK", // Action description
      code: "DFSK", // Date and time of the transaction
      description: "DFSK", // Transaction amount
      edit: "/images/icons/edit.svg", // Category of the transaction
      delete: "/images/icons/delete.svg",
    },
    {
      image: "/images/icons/edit.svg", // Path or URL for the image
      name: "MAHINDRA", // Action description
      code: "MHN", // Date and time of the transaction
      description: "MHN", // Transaction amount
      edit: "/images/icons/edit.svg", // Category of the transaction
      delete: "/images/icons/delete.svg",
    },
    {
      image: "/images/icons/edit.svg", // Path or URL for the image
      name: "MAZDA", // Vehicle Make name
      code: "MDA", // Vehicle Make Code
      description: "MDA", // Description
      edit: "/images/icons/edit.svg", // Category of the transaction
      delete: "/images/icons/delete.svg",
    },
  ]

  currentPage = 1;
  itemsPerPage = 5;

  get totalPages(): number {
    return Math.ceil(this.transactionData.length / this.itemsPerPage);
  }

  get currentItems(): Transaction[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.transactionData.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  handleViewMore(item: Transaction) {
    // logic here
    console.log('View More:', item);
  }

  handleDelete(item: Transaction) {
    // logic here
    console.log('Delete:', item);
  }

  getBadgeColor(status: string): 'success' | 'warning' | 'error' {
    if (status === 'Success') return 'success';
    if (status === 'Pending') return 'warning';
    return 'error';
  }
}
