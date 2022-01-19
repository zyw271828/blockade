export const apiEndpoints: string[] = [
  "http://localhost:3000/api/v1",
  "http://localhost:3001/api/v1",
  "http://localhost:3002/api/v1",
  "http://localhost:3003/api/v1",
  "http://localhost:3004/api/v1"
];

export let environment = {
  production: true,
  apiEndpoint: apiEndpoints[0],
  version: require('../../package.json').version
};

export const updateApiEndpoint = (index: number) => {
  if (index >= 0 && index <= apiEndpoints.length - 1) {
    environment.apiEndpoint = apiEndpoints[index];
    console.log('updateApiEndpoint: ' + environment.apiEndpoint);
  }
}
