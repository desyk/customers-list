import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';

import { ICustomer } from "src/app/shared/interfaces";


@Injectable()
export class GeoService {

  constructor(private http: HttpClient) {}

  fetchCoordinates(customer: ICustomer): Observable<any> {
    let geocodeQuery: string = environment.googleMapsGeoAddress + '?address=' + customer.city + ',+' + customer.state.name + '&key=' + environment.googleMapsApiKey;

    return this.http.get(geocodeQuery);
  }
}
