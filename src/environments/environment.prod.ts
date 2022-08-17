export const environment = {
  production: true,
  apiEndpoint: 'http://localhost:8081/api/v1', // TODO: set up production api endpoint
  contractsNodeWsPort: 9944,
  version: require('../../package.json').version
};
