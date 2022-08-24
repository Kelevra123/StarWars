import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ICharacter } from "../types";



@Component({
  selector: '.card-component',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardComponent implements AfterViewInit {
  @Input('char') public char: ICharacter | null = null;
  @ViewChild('cardCont') public container: ElementRef | null = null;

  ngAfterViewInit(): void {
    // A bit of visual (box-shadow)
    if (this.char?.affiliations.includes("Sith")) {
      this.container?.nativeElement.classList.add('card-component__container_empire');
    } else if (this.char?.affiliations.includes("Jedi Order")) {
      this.container?.nativeElement.classList.add('card-component__container_jedi');
    } else if (this.char?.species === 'droid') {
      this.container?.nativeElement.classList.add('card-component__container_droid');
    }
  }
}
