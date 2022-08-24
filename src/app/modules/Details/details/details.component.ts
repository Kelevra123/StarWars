import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ICharacter } from "../../Character/types";
import { ActivatedRoute } from "@angular/router";
import { CharacterService } from "../../Character/character.service";



@Component({
  selector: '.details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('container') public container: ElementRef | null = null;
  public character: ICharacter | null = null;
  public plug: string = 'No Data';
  public loading: boolean = true;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _characterService: CharacterService
  ) { }

  ngOnInit(): void {
    if (this._route.params) {
      this._route.params.subscribe(data => {
        if (data.hasOwnProperty('id')) {
          this._characterService.fetchOne(data['id']).subscribe(char => {
            this.character = char;
            if (typeof this.character?.masters === 'string') {
              this.character.masters = [this.character.masters]
            }
            this.changeSkin()
            this.loading = false;
          })
        }
      })
    }
  }

  ngAfterViewInit(): void {

  }

  private changeSkin() {
    if (this.character?.affiliations.includes('Sith')) {
      this.container?.nativeElement.classList.add('details__container_sith');
    }
    else if (this.character?.affiliations.includes("Jedi Order")) {
      this.container?.nativeElement.classList.add('details__container_jedi');
    }
    else if (this.character?.species === 'droid') {
      this.container?.nativeElement.classList.add('details__container_droid');
    }
    else {
      this.container?.nativeElement.classList.add('details__container_default');
    }
  }

}
