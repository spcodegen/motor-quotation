import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmPopupComponent } from "./pages/ui-elements/confirm-popup/confirm-popup.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    // ConfirmPopupComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular Ecommerce Dashboard | TailAdmin';
}
