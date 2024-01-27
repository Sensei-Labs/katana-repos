import instance from './instance';

export default async function validateJwt(request, response, next) {
  const requestHeaders = request.headers;

  try {
    await instance.get('/api/auth/ping', {
      headers: {
        authorization: requestHeaders.authorization,
      },
    });
    next();
  } catch (error) {
    next(error);
  }
}
