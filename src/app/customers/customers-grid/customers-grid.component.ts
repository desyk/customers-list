import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-customers-grid',
  templateUrl: './customers-grid.component.html',
  styleUrls: ['./customers-grid.component.css']
})
export class CustomersGridComponent implements OnInit {
  @Input() gridCustomers;
  @Input() filterName;
  page: number = 1;
  pageSize: number = 10;

  constructor() { }

  ngOnInit() {
  }

}
