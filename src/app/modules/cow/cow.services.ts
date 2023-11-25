import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/apiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../shared/paginationHelper';
import { User } from '../user/user.model';
import { cowSearchableFields } from './cow.constant';
import { ICow, ICowFilters } from './cow.interface';
import { Cow } from './cow.model';
import { verifyCowAndSeller } from './cow.utils';

const postCow = async (cowData: ICow): Promise<ICow | null> => {
  const cowSeller = await User.findById({ _id: cowData.seller });
  if (!cowSeller) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong seller id!');
  }
  if (cowSeller?.role !== 'seller') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unauthorized access!');
  }
  const newCow = await Cow.create(cowData);
  // await newCow.populate('seller');
  return newCow;
};

const getAllCows = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === 'minPrice') {
          return { price: { $gte: value } };
        }
        if (field === 'maxPrice') {
          return { price: { $lte: value } };
        }
        if (field === 'label' && value === 'all') {
          return {};
        }
        return { [field]: value };
      }),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Cow.find(whereConditions)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
      pageCount: Math.ceil(total / limit),
    },
    data: result,
  };
};

const getSellersCow = async (sellerId: string) => {
  const result = await Cow.find({ seller: sellerId });

  return result;
};

const getSingleCow = async (cowId: string): Promise<ICow | null> => {
  const cow = await Cow.findById({ _id: cowId }).populate('seller');
  if (!cow) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cow not found');
  }
  return cow;
};

const updateCow = async (
  cowId: string,
  sellerId: string,
  updatedData: Partial<ICow>
): Promise<ICow | null> => {
  //check if the cow exists and the seller is valid
  await verifyCowAndSeller(cowId, sellerId);

  const cow = await Cow.findByIdAndUpdate({ _id: cowId }, updatedData, {
    new: true,
  }).populate('seller');
  return cow;
};

const deleteCow = async (
  cowId: string,
  sellerId: string,
  role: string
): Promise<ICow | null> => {
  let result;
  if (role === 'admin') {
    result = await Cow.findByIdAndDelete({
      _id: cowId,
      label: { $ne: 'sold out' },
    });
  } else if (role === 'seller') {
    // Check if the cow exists and the seller is valid
    await verifyCowAndSeller(cowId, sellerId);

    // Check if the cow is not sold out before deleting
    result = await Cow.findByIdAndDelete({
      _id: cowId,
      label: { $ne: 'sold out' },
    });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unauthorized access');
  }
  return result;
};

export const CowService = {
  postCow,
  getAllCows,
  getSellersCow,
  getSingleCow,
  deleteCow,
  updateCow,
};
