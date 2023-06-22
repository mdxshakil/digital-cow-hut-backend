import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const invalidRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Api Not Found!',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'Api Not Found!',
      },
    ],
  });
  next();
};

export default invalidRouteHandler;
