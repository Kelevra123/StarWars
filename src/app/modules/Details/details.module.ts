import { NgModule } from "@angular/core";
import { DetailsComponent } from "./details/details.component";
import { CommonModule } from "@angular/common";
import { UIModule } from "../UI/UI.module";



@NgModule({
  declarations: [
    DetailsComponent
  ],
  imports: [
    CommonModule,
    UIModule
  ],
  providers: [],
  exports: [DetailsComponent]
})
export class DetailsModule { }
