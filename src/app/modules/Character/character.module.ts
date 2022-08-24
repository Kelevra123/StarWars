import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { CharacterComponent } from './character/character.component';
import { CharacterService } from "./character.service";
import { CommonModule } from "@angular/common";
import { CardComponent } from './card/card.component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UIModule } from "../UI/UI.module";
import { RouterModule } from "@angular/router";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [
    CharacterComponent,
    CardComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    FontAwesomeModule,
    UIModule,
    RouterModule,
    NgbDropdownModule
  ],
  providers: [CharacterService],
  exports: [CharacterComponent]
})
export class CharacterModule { }
