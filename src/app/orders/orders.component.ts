import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataService } from '../core/services/data.service';
import { ICustomer } from '../shared/interfaces';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  customers: ICustomer[];
  customersSubscription: Subscription;
  page: number = 1;
  pageSize: number = 5;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getCustomers();
  }

  getCustomers() {
    this.customersSubscription = this.dataService.fetchCustomers()
      .subscribe(
        (customers: ICustomer[]) => {
          this.customers = Object.values(customers);
        },
        (err: any) => {
          console.log(err);
        },
        () => {/* console.log('gotCustomers') */}
      );
  }

  ngOnDestroy() {
    this.customersSubscription.unsubscribe();
  }

}
