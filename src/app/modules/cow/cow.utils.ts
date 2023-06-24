import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import { Cow } from './cow.model';

export const verifyCowAndSeller = async (cowId: string, sellerId: string) => {
  const isExist = await Cow.findOne({ _id: cowId });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cow not found !');
  }
  // Check if the user is the seller of the cow
  if (isExist.seller.toString() !== sellerId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
  }
};
