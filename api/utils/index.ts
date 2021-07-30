export async function post(url: string, body?: any) {
  console.log('POST', url, body);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
  });
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
  return response;
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
