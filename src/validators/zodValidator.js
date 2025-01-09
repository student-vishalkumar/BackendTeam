import { StatusCodes } from 'http-status-codes';

import { customErrorResponse } from '../utils/common/responseObject.js';

export const validate = (schema) => {
  console.log('schema', schema)
  return async (req, res, next) => {
    try {
      console.log('log befor parseAsync at validate', req.body);
      // console.log('object', z.object);
      await schema.parseAsync(req.body);
      console.log('log befor parseAsync at validate', req.body);
      next();
    } catch (error) {
      console.log('error at validate', error)
      let explanation = [];
      let errorMessage = '';
      error.errors.forEach((key) => {
        explanation.push(key.path[0] + ' ' + key.message);
        errorMessage += ' : ' + key.path[0] + ' ' + key.message;
      });
      res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: 'Validation error' + errorMessage,
          explanation: explanation
        })
      );
    }
  };
};

