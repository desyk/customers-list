import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription/* , Observable */ } from 'rxjs';

import { ICustomer } from '../shared/interfaces';
import { DataService } from '../core/services/data.service';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit, OnDestroy {
  readonly viewModeEnum = viewModeEnumOut;
  viewMode: viewModeEnumOut;
  customers: ICustomer[];
  // to use for variant when customers is observable, not array:
  // customers: Observable<ICustomer[]>
  customersSubscription: Subscription;
  filteredName = '';

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getCustomers();
    this.viewMode = this.viewModeEnum.Card;
  }

  changeViewMode(mode: viewModeEnumOut) {
    this.viewMode = mode;
  }

  getCustomers() {
    this.customersSubscription = this.dataService.fetchCustomers()
      .subscribe(
        (customers: ICustomer[]) => {
          // convert object to array to prevent errors (fix for firebase)
          this.customers = Object.values(customers);
          this.generateImages();
        },
        (err: any) => {
          console.log(err);
        },
        () => {/* console.log('gotCustomers') */}
      );
    // to use async pipe we pass into template our observable
    // which resolves to customers array
    // we should additionally generate images in this case somehow
    // this.customers = this.dataService.fetchCustomers();
  }

  generateImages() {
    for (let idx in this.customers) {
      if (this.customers[idx].gender === 'male') {
        this.customers[idx]['icon'] = maleIcons[Math.floor(Math.random() * maleIcons.length)];
      } else {
        this.customers[idx]['icon'] = femaleIcons[Math.floor(Math.random() * femaleIcons.length)];
      }
    }
  }

  ngOnDestroy() {
    this.customersSubscription.unsubscribe();
  }

}

enum viewModeEnumOut {
  Card = 1,
  Grid,
  Map
}

const maleIcons = ['male1.png', 'male2.png', 'male3.png', 'male4.png'];

const femaleIcons = ['female1.png', 'female2.png', 'female3.png', 'female4.png'];
