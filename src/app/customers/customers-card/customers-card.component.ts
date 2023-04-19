import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-customers-card',
  templateUrl: './customers-card.component.html',
  styleUrls: ['./customers-card.component.css']
})
export class CustomersCardComponent implements OnInit {
  @Input() cardCustomers;
  @Input() filterName;
  page: number = 1;
  pageSize: number = 10;

  constructor() { }

  ngOnInit() {
  }

  onPageChange(page: number) {
    console.log('page changed to ' + page);
  }

}
