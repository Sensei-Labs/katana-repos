const utils = require('@strapi/utils');
const { ValidationError, NotFoundError, ApplicationError, UnauthorizedError } = utils.errors;

export const NOT_FOUND = NotFoundError;
export const BAD_REQUEST = ValidationError;
export const UNAUTHORIZED = UnauthorizedError;
export const SERVER_ERROR = ApplicationError;
