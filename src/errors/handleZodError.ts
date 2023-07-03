import { ZodError, ZodIssue } from 'zod';
import {
  IGenericErrorMessage,
  IGenericErrorResponse,
} from '../interfaces/error';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const statusCode = 400;
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleZodError;
