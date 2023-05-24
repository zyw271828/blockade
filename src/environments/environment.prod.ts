export const apiEndpoints: string[] = [
  "http://localhost:8081/api/v1",
  "http://localhost:8082/api/v1",
  "http://localhost:8083/api/v1",
  "http://localhost:8084/api/v1",
  "http://localhost:8085/api/v1",
  "http://localhost:8086/api/v1",
  "http://localhost:8087/api/v1",
  "http://localhost:8088/api/v1",
  "http://localhost:8089/api/v1",
  "http://localhost:8090/api/v1",
  "http://localhost:8091/api/v1",
  "http://localhost:8092/api/v1"
];

export let environment = {
  production: true,
  apiEndpoint: apiEndpoints[0],
  contractsNodeWsPort: 9944,
  version: require('../../package.json').version
};

export const updateApiEndpoint = (index: number) => {
  if (index >= 0 && index <= apiEndpoints.length - 1) {
    environment.apiEndpoint = apiEndpoints[index];
    console.log('updateApiEndpoint: ' + environment.apiEndpoint);
  }
}
