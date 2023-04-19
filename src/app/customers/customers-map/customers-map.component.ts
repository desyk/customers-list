import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';

import { ICustomer } from 'src/app/shared/interfaces';


@Component({
  selector: 'app-customers-map',
  templateUrl: './customers-map.component.html',
  styleUrls: ['./customers-map.component.css']
})
export class CustomersMapComponent implements OnInit, AfterViewInit {
  @ViewChild('agmMap') agmMap;
  @Input() mapCustomers: ICustomer[];
  @Input() filterName;
  page: number = 1;
  pageSize: number = 10;

  constructor() { }

  ngOnInit() {
  }

  onPageChange(page: number) {
    console.log('page changed to ' + page);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log('Resizing');
      this.agmMap.triggerResize();
    }, 100);
  }

}
