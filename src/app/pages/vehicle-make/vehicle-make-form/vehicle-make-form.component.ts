import { Component } from '@angular/core';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { TextAreaComponent } from "../../../shared/components/form/input/text-area.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";

@Component({
  selector: 'app-vehicle-make-form',
  imports: [ButtonComponent, TextAreaComponent, LabelComponent, InputFieldComponent, ComponentCardComponent],
  templateUrl: './vehicle-make-form.component.html',
})
export class VehicleMakeFormComponent {
message = '';
}
