import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ICustomer } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/core/services/data.service';


@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css']
})
export class CustomerOrdersComponent implements OnInit {
  customerId: number;
  customer: ICustomer;
  customerSubscription: Subscription;

  constructor(private dataService: DataService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.customerId = +this.route.snapshot.params['id'];

    this.customerSubscription = this.dataService.fetchCustomer(this.customerId)
      .subscribe(
        (customer: ICustomer) => {
          this.customer = customer;
        }
      );
  }
  ngOnDestroy() {
    this.customerSubscription.unsubscribe();
  }

}
