let _accessToken: string | undefined;
export function setAccessToken(token: string | undefined) {
  _accessToken = token;
}

export async function post(url: string, body?: any) {
  console.log('POST', url, body);
  const response = await fetch(url, {
    method: 'POST',
    // @ts-ignore: `headers` either has an `Authorization` string property or
    // hasn't, but TypeScript incorrectly infers `headers` always has an
    // `Authorization` property that can either be a string or undefined:
    headers: Object.assign(
      { 'Content-Type': 'application/json' },
      _accessToken ? { Authorization: `Bearer ${_accessToken}` } : {}
    ),
    body: body && JSON.stringify(body),
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

export async function postURLEncodedFormData(url: string, body?: any) {
  const encodedBody = createURLSearchParamsFrom(body);
  console.log('POST', url, encodedBody.toString());
  const response = await fetch(url, {
    method: 'POST',
    // Passing a URLSearchParams object to body isn't working as it should. It
    // doesn't set the Content-Type nor the request body, so we do it ourselves:
    body: encodedBody.toString(),
    // @ts-ignore: `headers` either has an `Authorization` string property or
    // hasn't, but TypeScript incorrectly infers `headers` always has an
    // `Authorization` property that can either be a string or undefined:
    headers: Object.assign(
      { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      _accessToken ? { Authorization: `Bearer ${_accessToken}` } : {}
    ),
  });
  await handleNonSuccessfulResponse(response);
  return response;
}

function createURLSearchParamsFrom(obj: any) {
  const params = new URLSearchParams();
  for (const propName in obj) {
    params.append(propName, obj[propName].toString());
  }
  return params;
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
