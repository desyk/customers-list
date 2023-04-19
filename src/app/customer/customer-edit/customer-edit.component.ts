import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { DataService } from 'src/app/core/services/data.service';
import { GeoService } from 'src/app/core/services/geo.service';
import { IState, ICustomer } from 'src/app/shared/interfaces';


@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent implements OnInit, OnDestroy {
  editMode: boolean = false;
  customerId: number = 0;
  pageHeader: string = "Edit customer";
  submitted: boolean = false;
  customer: ICustomer = {
    id: 0,
    firstName: '',
    lastName: '',
    gender: '',
    address: '',
    city: '',
    state: {
      abbreviation: '',
      name: ''
    },
  };
  states: IState[];
  routeSubscription: Subscription;
  statesSubscription: Subscription;
  nextIdSubscription: Subscription;
  customerSubscription: Subscription;
  customersSubscription: Subscription;
  updateCustomersSubscription: Subscription;
  geoSubscription: Subscription;
  selectedStateAbbr: string;
  @ViewChild('customerForm') customerForm: NgForm;
  customers: ICustomer[];
  deleteMessageEnabled: boolean = false;

  constructor(private dataService: DataService,
              private geoService: GeoService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit() {
    if (this.editMode === false) {
      this.pageHeader = 'Create new customer';
    }

    this.routeSubscription = this.route.params
      .subscribe(
        (params: Params) => {
          if (params['id']) {
            this.customerId = +params['id'];
            this.editMode = true;

            this.getCustomer(this.customerId);
          }
        }
      );

    this.getStates();

    this.nextIdSubscription = this.dataService.fetchCustomersNextId()
      .subscribe(
        (nextId: number) => {
          if (this.editMode == false) {
            this.customer.id = nextId;
          }
        }
      );
  }

  getCustomer(customerId: number) {
    this.customerSubscription = this.dataService.fetchCustomer(customerId)
      .subscribe(
        (customer: ICustomer) => {
          if (customer == undefined) {
            this.router.navigate(['/customer', 'new']);
          }

          this.customer = customer;
          this.fillForm();
        },
        (error: any) => { console.log(error); }
      );
    
    // we'll need all customers later. workround for firebase
    this.customersSubscription = this.dataService.fetchCustomers()
    .subscribe(
      (customers: ICustomer[]) => {
        this.customers = customers;
      }
    );
  }

  updateCustomer(isDelete: boolean = false) {
    let localIdx: string;

    for (var idx in this.customers) {
      if (this.customers.hasOwnProperty(idx)) {
        if (this.customers[idx].id == this.customer.id) {
          if (isDelete) {
            delete this.customers[idx];
          } else {
            this.customers[idx] = {
              ...this.customers[idx],
              ... this.customer
            }; // update customers object with new values;

            localIdx = idx;
          }
        }
      }
    }

    // get coordinates with google geocode api and then update customers in db
    this.geoSubscription = this.geoService.fetchCoordinates(this.customer)
      .subscribe(
        (response: any) => {
          if(response.status == 'OK') {
            this.customer.latitude = response.results['0']['geometry']['location']['lat'];
            this.customer.longitude = response.results['0']['geometry']['location']['lng'];
          }

          // update customer with coordinates
          this.customers[localIdx] = this.customer;

          // update customers in db
          this.updateCustomersSubscription = 
            this.dataService.updateCustomers(this.customers)
            .subscribe(
              (customers: ICustomer[]) => {
                console.log(customers);
              }
          );
        }
      );
  }

  getStates() {
    this.statesSubscription = this.dataService.fetchStates()
      .subscribe(
        (states: IState[]) => {
          this.states = states;
        }
      );
  }

  onSubmit(form: NgForm) {
    this.customer = {
      id: this.customer.id,
      firstName : form.value.firstName,
      lastName : form.value.lastName,
      gender: form.value.gender,
      address : form.value.address,
      city: form.value.city,
      state: {
        abbreviation: form.value.state,
        name: this.customer.state.name
      }
    };

    if (this.editMode == false) {
      this.dataService.insertCustomer(this.customer)
        .subscribe(
          (recordName: object) => {
            console.log(recordName);
          },
          (error: any) => { console.log(error); }
        );
    } else {
      this.updateCustomer();
    }

    if (this.editMode == false) {
      form.reset();
    }
  }

  onReset(form: NgForm) {
    this.fillForm();
  }

  onDelete() {
    this.updateCustomer(true);

    this.customer = {
      id: 0,
      firstName: '',
      lastName: '',
      gender: '',
      address: '',
      city: '',
      state: {
        abbreviation: '',
        name: ''
      }
    };
    
    this.fillForm();
    this.deleteMessageEnabled = false;
  }

  updateSelectedState(stateAbbr: string): void {
    if (this.states && stateAbbr) {
       let selectedState = this.states.find(s => s.abbreviation == stateAbbr);
       if (selectedState)
         this.customer.state.name = selectedState.name;
    } else {
      this.customer.state.name = '';
    }
  }

  fillForm() {
    this.customerForm.setValue({
      firstName: this.customer.firstName,
      lastName: this.customer.lastName,
      gender: this.customer.gender,
      address: this.customer.address,
      city: this.customer.city,
      state: this.customer.state.abbreviation
    });
  }

  ngOnDestroy() {
    if (this.statesSubscription) this.statesSubscription.unsubscribe();
    if (this.nextIdSubscription) this.nextIdSubscription.unsubscribe();
    if (this.customersSubscription) this.customersSubscription.unsubscribe();
    if (this.updateCustomersSubscription) this.updateCustomersSubscription.unsubscribe();
    if (this.geoSubscription) this.geoSubscription.unsubscribe();
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
  }

}
