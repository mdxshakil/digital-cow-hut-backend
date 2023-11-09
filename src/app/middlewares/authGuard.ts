import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/apiError';
import { jwtHelper } from '../../shared/jwtHelper';

const authGuard =
  (...permittedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get the access token and verify it
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }
      const verifiedToken = jwtHelper.verifyToken(
        token,
        config.jwt.secret as Secret
      );
      if (!verifiedToken.userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token');
      }
      //if verified, set the payload to req object
      req.user = verifiedToken;
      //role based authorization
      if (
        permittedRoles.length &&
        !permittedRoles.includes(verifiedToken.role)
      ) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
      }
      //go to next middleware
      next();
    } catch (error) {
      next(error);
    }
  };

export default authGuard;
