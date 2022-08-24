import { NgModule } from "@angular/core";
import { SpinnerComponent } from './spinner/spinner.component';
import { FieldComponent } from './field/field.component';



@NgModule({
  declarations: [
    SpinnerComponent,
    FieldComponent
  ],
  imports: [],
  providers: [],
  exports: [SpinnerComponent, FieldComponent]
})
export class UIModule { }
