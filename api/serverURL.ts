let baseURL = 'https://scapeapi.azurewebsites.net';
export function setServerBaseURL(newBaseURL: string) {
  // For validation (it throws an error if the url is not valid):
  new URL(newBaseURL);
  baseURL = newBaseURL;
}
export default baseURL;

export function createEndpointGetter(baseEndpoint: string) {
  return function getEndpoint(path?: string) {
    let endpoint = new URL(baseEndpoint, baseURL);
    if (path) {
      endpoint = new URL(path, endpoint);
    }
    return endpoint.toString();
  }
}
