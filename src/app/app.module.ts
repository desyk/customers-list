import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CustomersComponent } from './customers/customers.component';
import { OrdersComponent } from './orders/orders.component';
import { HeaderComponent } from './core/header/header.component';
import { AboutComponent } from './about/about.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomersCardComponent } from './customers/customers-card/customers-card.component';
import { CustomersGridComponent } from './customers/customers-grid/customers-grid.component';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
import { CustomerOrdersComponent } from './customer/customer-orders/customer-orders.component';
import { AuthModule } from './auth/auth.module';
import { DataService } from './core/services/data.service';
import { GeoService } from './core/services/geo.service';
import { AgmCoreModule } from '@agm/core';
import { CustomersMapComponent } from './customers/customers-map/customers-map.component';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { FilterPipe } from './core/pipes/filter.pipe';


@NgModule({
  declarations: [
    AppComponent,
    CustomersComponent,
    OrdersComponent,
    HeaderComponent,
    AboutComponent,
    CustomerEditComponent,
    CustomerDetailsComponent,
    CustomerComponent,
    CustomersCardComponent,
    CustomersGridComponent,
    CustomerOrdersComponent,
    CustomersMapComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AuthModule,
    AppRoutingModule,
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: '' // for google maps
    }),
    SharedModule,
  ],
  providers: [
    DataService,
    GeoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard,
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
