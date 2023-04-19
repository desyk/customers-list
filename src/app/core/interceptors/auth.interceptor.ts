import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpParams
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { take, exhaustMap } from "rxjs/operators";

import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
  Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1), // take 1 user and unsubscribe
      exhaustMap(user => { // swap user observable with http observable (next.handle is observable too)
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq  = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
