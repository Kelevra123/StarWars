import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';



@Component({
  selector: '.field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FieldComponent implements OnInit {
  @Input() public title: any = '';
  @Input() public data: any = '';

  constructor() { }

  ngOnInit(): void {
  }

}
