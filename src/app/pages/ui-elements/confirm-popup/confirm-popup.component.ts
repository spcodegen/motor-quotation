import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';


@Component({
  selector: 'app-confirm-popup',
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (visible) {
    <!-- Backdrop -->
    <div class="fixed inset-0 z-[9998] bg-black bg-opacity-50 backdrop-blur-sm"></div>
    
    <!-- Modal -->
    <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto dark:bg-gray-800 transform transition-all duration-300 scale-100">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <button
            type="button"
            (click)="onCancel()"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            [disabled]="isLoading"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="p-6">
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full dark:bg-red-900/20">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          
          <p class="text-center text-gray-600 dark:text-gray-300 mb-2">
            {{ message }}
          </p>
          <p class="text-center font-semibold text-lg text-gray-900 dark:text-white mb-4" *ngIf="itemName">
            "{{ itemName }}"
          </p>
          <p class="text-center text-sm text-red-600 dark:text-red-400" *ngIf="warningText">
            {{ warningText }}
          </p>
        </div>
        
        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 rounded-b-xl dark:bg-gray-700/50">
          <app-button
            size="sm"
            variant="outline"
            (btnClick)="onCancel()"
            [disabled]="isLoading"
          >
            Cancel
          </app-button>
          
          <!-- Custom Delete Button -->
          <button
            type="button"
            (click)="onConfirm()"
            [disabled]="isLoading"
            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            @if (isLoading) {
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            }
            {{ confirmButtonText }}
          </button>
        </div>
      </div>
    </div>
    }
  `,
  styles: ``
})
export class ConfirmPopupComponent {
  @Input() visible = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() itemName = '';
  @Input() warningText = 'This action cannot be undone.';
  @Input() confirmButtonText = 'Confirm';
  @Input() isLoading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}