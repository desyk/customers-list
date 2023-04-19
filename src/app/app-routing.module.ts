import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { CustomersComponent } from "./customers/customers.component";
import { OrdersComponent } from "./orders/orders.component";
import { AboutComponent } from "./about/about.component";
import { CustomerComponent } from "./customer/customer.component";
import { CustomerDetailsComponent } from "./customer/customer-details/customer-details.component";
import { CustomerEditComponent } from "./customer/customer-edit/customer-edit.component";
import { CustomerOrdersComponent } from "./customer/customer-orders/customer-orders.component";
import { AuthGuard } from "./auth/auth.guard";


const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/customers' },
  { path: 'customers', component: CustomersComponent },
  // { path: 'customer', children: [ // empty component for example
  { 
    path: 'customer',
    component: CustomerComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/customers' },
      { path: 'new', component: CustomerEditComponent },
      { path: ':id/edit', component: CustomerEditComponent },
      { path: ':id/details', component: CustomerDetailsComponent },
      { path: ':id/orders', component: CustomerOrdersComponent },
    ] 
  },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard], },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '/customers' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule {}
