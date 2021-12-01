/** `delete` is a reserved word, hence `delete_` */
export function delete_(url: string, body?: any) {
  return request(
    'DELETE', url,
    body == null ? undefined : { 'Content-Type': 'application/json' },
    body == null ? undefined : JSON.stringify(body)
  );
}

export async function get(url: string, body?: any) {
  if (body != null) {
    const theUrl = new URL(url);
    theUrl.search = createURLSearchParamsFrom(body).toString();
    url = theUrl.toString();
  }
  return request('GET', url);
}

export function post(url: string, body?: any) {
  return request(
    'POST', url,
    body == null ? undefined : { 'Content-Type': 'application/json' },
    body == null ? undefined : JSON.stringify(body)
  );
}

export async function postURLEncodedFormData(url: string, body?: any) {
  return request(
    'POST', url,
    // Passing a URLSearchParams object to body isn't working as it should. It
    // doesn't set the Content-Type nor the request body, so we do it ourselves:
    body == null ? undefined : {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body == null ? undefined : createURLSearchParamsFrom(body).toString(),
  );
}

function createURLSearchParamsFrom(obj: any) {
  const params = new URLSearchParams();
  for (const propName in obj) {
    params.append(propName, obj[propName].toString());
  }
  return params;
}

export function put(url: string, body?: any) {
  return request(
    'PUT', url,
    body == null ? undefined : { 'Content-Type': 'application/json' },
    body == null ? undefined : JSON.stringify(body)
  );
}

let _accessToken: string | undefined;
export function setAccessToken(token: string | undefined) {
  _accessToken = token;
}

async function request(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  headers?: { [key: string]: string },
  body?: RequestInit['body'],
) {
  const response = await fetch(url, {
    method,
    // @ts-ignore: `headers` either has an `Authorization` string property or
    // hasn't, but TypeScript incorrectly infers `headers` always has an
    // `Authorization` property that can either be a string or undefined:
    headers: Object.assign(
      _accessToken ? { Authorization: `Bearer ${_accessToken}` } : {},
      headers
    ),
    body,
  });
  await handleNonSuccessfulResponse(response);
  return response;
}

async function handleNonSuccessfulResponse(response: Response) {
  if (!response.ok) {
    const text = await response.text();
    const error = new Error();
    if (response.status === 400) {
      error.name = 'BadRequestError';
      error.message = text;
    } else {
      error.message = `${response.status}: ${response.statusText}\n${text}`;
    }
    throw error;
  }
}

export function translateBadRequestErrorMessage<T>(
  request: Promise<T>, translations: Map<string, string>
) {
  return request.catch(error => {
    if (error.name === 'BadRequestError') {
      error.message = translations.get(error.message) ?? error.message;
    }
    throw error;
  });
}
