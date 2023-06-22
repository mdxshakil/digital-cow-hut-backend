import { CastError } from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error';

export const handleCastError = (error: CastError) => {
  const statusCode = 400;
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: 'Invalid id',
    },
  ];
  return {
    statusCode,
    message: 'Cast Error',
    errorMessages: errors,
  };
};
