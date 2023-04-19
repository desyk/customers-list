import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';

import { User } from "src/app/auth/user.model";


export interface AuthResponseData {
  kind:	string;
  idToken:	string;
  email:	string;
  refreshToken:	string;
  expiresIn:	string;
  localId:	string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  readonly authErrors = authErrors;
  user = new BehaviorSubject<User>(null); // don't really use BehaviorSubject here. just in case
  // user = new Subject<User>();
  isUserAuthenticated = false;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router,
              private cookies: CookieService) {}

  register(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.firebaseNewUserPath + environment.firebaseApiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(
        (errorRes: HttpErrorResponse) => {
          return this.handleError(errorRes);
        }
        // or just catchError(this.handleError.bind(this)) 
        // we need to bind "this" coz catchError calls handleError
        // with it's own context, so our this won't work as expected 
        // also such way cause strange gui error which caused by ".bind(this)"
      ),
      tap(resData => {
        this.HandleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        );
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
     environment.firebaseLoginPath + environment.firebaseApiKey,
     {
      email: email,
      password: password,
      returnSecureToken: true
     } 
    ).pipe(
      catchError(
        (errorRes: HttpErrorResponse) => {
          return this.handleError(errorRes);
        }
      ),
      tap(resData => {
        this.HandleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        );
      })
    );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = this.cookies.get('userData') ? JSON.parse(this.cookies.get('userData')) : null;

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      this.isUserAuthenticated = true;

      const expirationDuration = 
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string = "An unkown error occurred";

    if (errorRes.error && errorRes.error.error &&
        errorRes.error.error.message in this.authErrors) {
      errorMessage = this.authErrors[errorRes.error.error.message];
    }

    return throwError(errorMessage);
  }

  private HandleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.isUserAuthenticated = true;

    this.autoLogout(expiresIn * 1000)

    this.cookies.set('userData', JSON.stringify(user));
    // this.cookies.set(
    //   'userData',
    //   JSON.stringify(user),
    //   expirationDate, // don't realy need it, we delete cookie in logout
    //   '/', // path
    //   '', // domain
    //   true, // secure
    //   'Strict' // same site
    // );
    // cannot read cookie with "secure: true" => disabled it at all
  }

  isAuthenticated() {
    if (this.isUserAuthenticated) {
      return true;
    }
    return false;
  }

  logout() {
    this.user.next(null);
    this.isUserAuthenticated = false;
    this.router.navigate(['/customers']); // navigate when auto logout
    this.cookies.delete('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(
      () => {
        this.logout();
      }, expirationDuration
    );
  }
}

const authErrors = {
  EMAIL_EXISTS: "The email address is already in use by another account.",
  OPERATION_NOT_ALLOWED: "Password sign-in is disabled for this project.",
  TOO_MANY_ATTEMPTS_TRY_LATER: "We have blocked all requests from this device due to unusual activity. Try again later.",
  EMAIL_NOT_FOUND: "There is no user record corresponding to this identifier. The user may have been deleted.",
  INVALID_PASSWORD: "The password is invalid or the user does not have a password.",
  USER_DISABLED: "The user account has been disabled by an administrator.",
};
