let _baseURL = 'https://scapeapi.azurewebsites.net';
const get = () => _baseURL;
const set = (newBaseURL: string) => {
  // For validation (it throws an error if the url is not valid):
  new URL(newBaseURL);
  _baseURL = newBaseURL;
};
export default { get, set };

export function createEndpointGetter(baseEndpoint: string) {
  return function getEndpoint(path?: string) {
    let endpoint = new URL(baseEndpoint, _baseURL);
    if (path) {
      endpoint = new URL(path, endpoint);
    }
    return endpoint.toString();
  }
}
