import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterComponent } from "./modules/Character/character/character.component";
import { DetailsComponent } from "./modules/Details/details/details.component";

const routes: Routes = [
  {path: '', component: CharacterComponent},
  {path: 'details/:id', component: DetailsComponent},
  {path: '**', redirectTo: ''}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
