import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ICustomer } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/core/services/data.service';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
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
          this.generateImage();
        }
      );
  }

  generateImage() {
    // not realy generate here, just get first image
    if (this.customer.gender === 'male') {
      this.customer['icon'] = 'male3.png';
    } else {
      this.customer['icon'] = 'female3.png';
    }
  }

  ngOnDestroy() {
    this.customerSubscription.unsubscribe();
  }

}
