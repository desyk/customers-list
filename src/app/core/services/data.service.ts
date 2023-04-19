import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from '../../../environments/environment';

import { ICustomer, IState } from "src/app/shared/interfaces";


@Injectable()
export class DataService {
  // customersBaseUrl = '/assets/data/customers.json';
  // statesBaseUrl = '/assets/data/states.json';

  constructor(private http: HttpClient) {}

  fetchCustomers(): Observable<ICustomer[]> {
    // return this.http.get<ICustomer[]>(this.customersBaseUrl);
    return this.http.get<ICustomer[]>(environment.customersFirebaseUrl)
    .pipe(
      map((customers: ICustomer[]) => {
        let customersArr = Object.values(customers);
        this.calculateCustomersOrderTotal(customersArr);

        return customersArr;
      })
    );
  }

  fetchCustomer(customerId: number): Observable<ICustomer> {
    // get customer from full customers array
    // coz we need firebase angular module to properly work with firebase
    // so we just get all customers, find needed and sent it as observable
    return this.http.get<ICustomer[]>(environment.customersFirebaseUrl)
      .pipe(
        map((customers: ICustomer[]) => {
          let customersArr = Object.values(customers);
          let customer = customersArr.find(c => c.id == customerId);
          this.calculateCustomersOrderTotal([customer]);

          return customer; // could be undefined if we can't find such customer
        })
      );
  }

  insertCustomer(customer: ICustomer): Observable<ICustomer> {
    return this.http.post<ICustomer>(
      environment.customersFirebaseUrl,
      customer
    );
  }

  updateCustomers(customers: ICustomer[]) {
    return this.http.put<ICustomer[]>(
      environment.customersFirebaseUrl,
      customers
    );
  }

  fetchCustomersNextId(): Observable<number> {
    return this.http.get<ICustomer[]>(environment.customersFirebaseUrl)
      .pipe(
        map((customers: ICustomer[]) => {
          return Object.keys(customers).length;
        })
      );
  }

  fetchStates(): Observable<IState[]> {
    // return this.http.get<IState[]>(this.statesBaseUrl);
    return this.http.get<IState[]>(environment.statesFirebaseUrl);
  }

  calculateCustomersOrderTotal(customers: ICustomer[]) {
    for (const customer of customers) {
      if ('orders' in customer) {
        let totalCost: number = 0;

        for (const order of customer.orders) {
          totalCost += order.itemCost;
        }

        customer.orderTotal = +totalCost.toFixed(2);
      }
    }
  }

}
