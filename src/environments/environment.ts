// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const apiEndpoints: string[] = [
  "http://localhost:3000/api/v1",
  "http://localhost:3001/api/v1",
  "http://localhost:3002/api/v1",
  "http://localhost:3003/api/v1",
  "http://localhost:3004/api/v1"
];

export let environment = {
  production: false,
  apiEndpoint: apiEndpoints[0],
  version: require('../../package.json').version + '-dev'
};

export const updateApiEndpoint = (index: number) => {
  if (index >= 0 && index <= apiEndpoints.length - 1) {
    environment.apiEndpoint = apiEndpoints[index];
    console.log('updateApiEndpoint: ' + environment.apiEndpoint);
  }
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
