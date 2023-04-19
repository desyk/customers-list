import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";

import { AuthService, AuthResponseData } from "../core/services/auth.service";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  authSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    if (this.router.url == '/login') {
      this.isLoginMode = true;
    } else if (this.router.url == '/register') {
      this.isLoginMode = false;
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      // normally this method won't trigger if form is not falid, but just in case
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    // make one observable for register and login case to avoid code repetition
    let authObservsable: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObservsable = this.authService.login(email, password);
    } else {
      authObservsable = this.authService.register(email, password);
    }

    this.authSubscription = authObservsable.subscribe(
      (responseData: any) => {
        // console.log(responseData);
        this.isLoading = false;
        this.router.navigate(['/customers']);
      },
      (errorMessage: string) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  ngOnDestroy() {
    if (this.authSubscription) this.authSubscription.unsubscribe();
  }
}
