import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CharacterService } from "../character.service";
import { ICharacter } from "../types";
import { HttpErrorResponse } from "@angular/common/http";
import { Subscription } from "rxjs";
import { ViewportScroller } from "@angular/common";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";

export enum SortMethod {
  CLEAR = 'Sort by',
  NAME = 'NAME',
  TYPE = 'TYPE'
}

export enum FilterMethod {
  CLEAR = 'Filter by',
  ALIVE = 'ALIVE',
  DEAD = 'DEAD'
}

export enum LocalStorageKeys {
  FILTER = 'prevFilter',
  SORT = 'prevSort'
}



@Component({
  selector: '.character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CharacterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('inter') public inter: ElementRef | null = null;

  //For filter & sort
  public charactersData: ICharacter[] = [];
  public infinityScrollData: ICharacter[] = [];
  public originalData: ICharacter[] = [];

  //Control setup
  public limit: number = 16;
  public error: HttpErrorResponse | null = null;
  public faArrow = faCircleArrowUp;
  public isButtonVisible: boolean = false;
  public loading: boolean = true;
  private startLoopInc: number = 1;

  //Methods
  public sortMethod: null | SortMethod | string = SortMethod.CLEAR;
  public filterMethod: null | FilterMethod | string = FilterMethod.CLEAR;

  //Streams
  private observer: IntersectionObserver | null = null;
  private serviceSubs: Subscription | null = null;
  public searchValue: string = '';

  constructor(
    private readonly _characterService: CharacterService,
    private _viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.serviceSubs = this._characterService.fetch().subscribe(data => {
      this.init(data);
    }, error => this.error = error);
  }

  private init(data: ICharacter[]): void {
    this.charactersData = [...data];
    this.originalData = this.charactersData.slice();

    const prevSortMethod = localStorage.getItem(LocalStorageKeys.SORT);
    if (prevSortMethod) this.isNeedToSort(prevSortMethod);
    const prevFilterMethod = localStorage.getItem(LocalStorageKeys.FILTER);
    if (prevFilterMethod) this.isNeedToFilter(prevFilterMethod);

    this.infinityScrollData = this.charactersData.slice(0, this.limit);
    this.loading = false;
    this.observe();
  }

  ngAfterViewInit(): void {
    this.observe();
  }

  private observe(): void {
    this._viewportScroller.scrollToPosition([0, 0]);
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.loading) {
        this.updateScroll();
      }
    });
    if (this.inter) this.observer.observe(this.inter.nativeElement);
  }

  public scroll(event: MouseEvent): void {
    event.stopPropagation();
    this._viewportScroller.scrollToPosition([0, 0]);
  }

  //State change methods

  changeSortMethod(sort: string): void {
    switch (sort) {
      case SortMethod.NAME:
        this.isNeedToSort(SortMethod.NAME);
        break;
      case SortMethod.TYPE:
        this.isNeedToSort(SortMethod.TYPE);
        break;
      case '':
        this.isNeedToSort(SortMethod.CLEAR);
        break;
      default: return;
    }
  }

  changeFilterMethod(filter: string): void {
    switch (filter) {
      case FilterMethod.ALIVE:
        this.isNeedToFilter(FilterMethod.ALIVE);
        break;
      case FilterMethod.DEAD:
        this.isNeedToFilter(FilterMethod.DEAD);
        break;
      case '':
        this.isNeedToFilter(FilterMethod.CLEAR);
        break;
      default: return;
    }
  }

  private isNeedToSort(method: SortMethod | string): void {
      this.sortMethod = method;
      this.sort();
      this.infinityScrollData = this.charactersData.slice(0, this.limit);
  }

  private isNeedToFilter(method: FilterMethod | string): void {
      this.filterMethod = method;
      this.filter();
      this.infinityScrollData = this.charactersData.slice(0, this.limit);
  }

  //View change methods

  private sort(): void {
    switch (this.sortMethod) {
      case SortMethod.NAME:
        this.charactersData.sort((a, b) => a.name.localeCompare(b.name));
        localStorage.setItem(LocalStorageKeys.SORT, SortMethod.NAME);
        break;
      case SortMethod.TYPE:
        this.charactersData.sort((a, b) => a.species.localeCompare(b.species));
        localStorage.setItem(LocalStorageKeys.SORT, SortMethod.TYPE);
        break;
      case SortMethod.CLEAR:
        localStorage.removeItem(LocalStorageKeys.SORT);
        if (this.filterMethod && this.filterMethod !== FilterMethod.CLEAR) {
          this.charactersData = this.charactersData.slice();
        }
        else {
          this.charactersData = this.originalData.slice();
        }
        break;
      default: return;
    }
  }

  private filter(): void {
    this.startLoopInc = 1;
    this.sortMethod = SortMethod.CLEAR;
    switch (this.filterMethod) {
      case FilterMethod.ALIVE:
        this.charactersData = this.originalData.filter(d => !d.died);
        localStorage.setItem(LocalStorageKeys.FILTER, FilterMethod.ALIVE);
        break;
      case FilterMethod.DEAD:
        this.charactersData = this.originalData.filter(d => d.died);
        localStorage.setItem(LocalStorageKeys.FILTER, FilterMethod.DEAD);
        break;
      case FilterMethod.CLEAR:
        this.charactersData = this.originalData.slice();
        localStorage.removeItem(LocalStorageKeys.FILTER);
        break;
      default: return;
    }
  }

  public search(event: any): void {
    this.searchValue = event.target.value;
    if (this.searchValue.length && this.searchValue.trim()) {
      this.charactersData = this.originalData.filter(d => d.name.toLowerCase().includes(this.searchValue.toLowerCase())).slice();
      this.infinityScrollData = this.charactersData.slice(0, this.limit * this.startLoopInc);
    }
    else {
      this.charactersData = this.originalData.slice()
      this.infinityScrollData = this.charactersData.slice(0, this.limit * this.startLoopInc);
      this.isNeedToSort(this.sortMethod || '');
    }
    this.startLoopInc = 1;
  }

  private updateScroll(): void {
    this.startLoopInc++;
    this.isButtonVisible = true;
    if (this.startLoopInc * this.limit > this.charactersData.length) {
      this.startLoopInc = this.charactersData.length;
      this.observer?.unobserve(this.inter?.nativeElement);
    }
    this.infinityScrollData = this.charactersData.slice(0, this.limit * this.startLoopInc);
  }

  ngOnDestroy(): void {
    this.serviceSubs?.unsubscribe();
    this.observer?.unobserve(this.inter?.nativeElement);
    this.observer?.disconnect();
  }

}
