// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseApiKey: '',
  firebaseNewUserPath: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=',
  firebaseLoginPath: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=',
  customersFirebaseUrl: 'https://angular-project-me.firebaseio.com/customers.json',
  statesFirebaseUrl: 'https://angular-project-me.firebaseio.com/states.json',
  googleMapsApiKey: '',
  googleMapsGeoAddress: 'https://maps.googleapis.com/maps/api/geocode/json',
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
