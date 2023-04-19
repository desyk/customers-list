import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

import { AuthService } from "../core/services/auth.service";


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): 
    boolean | 
    Promise<boolean> | 
    Observable<boolean> {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    // or
    // return this.router.createUrlTree(['/login']); // redirects if we not logged in. But this doesn't work in my version of angular
    // simple because we have isAuthenticated() mehood which returs boolean
    // or we could use our user object like this:
    // return this.authService.user.pipe(
    //   take(1),
    //   map(
    //     user => {
    //       const isAuth = !!user; // true if the is user, false if not
    //       if (isAuth) {
    //         return true;
    //       }
    //       this.router.navigate(['/login']);
    //       // return this.router.createUrlTree(['/login']);
    //     }
    //   )
    // );
  }
}
