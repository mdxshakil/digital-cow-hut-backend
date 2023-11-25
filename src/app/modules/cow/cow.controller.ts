import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { cowFilterableFields } from './cow.constant';
import { ICow } from './cow.interface';
import { CowService } from './cow.services';

const postCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const cowData = req.body;
    const result = await CowService.postCow(cowData);
    sendResponse<ICow>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Cow created successfully',
      data: result,
    });
  }
);

const getAllCows: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, cowFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const result = await CowService.getAllCows(filters, paginationOptions);
    sendResponse<ICow[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Cows retrived successfully',
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSellersCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const sellerId = req?.user?.userId as string;
    const result = await CowService.getSellersCow(sellerId);
    sendResponse<ICow[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Cows retrived successfully',
      data: result,
    });
  }
);

const getSingleCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CowService.getSingleCow(req.params.id);
    sendResponse<ICow>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Cow retrived successfully',
      data: result,
    });
  }
);

const deleteCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const cowId = req.params?.id;
    const sellerId = req.user?.userId;
    const role = req.user?.role;

    const result = await CowService.deleteCow(cowId, sellerId, role);
    sendResponse<ICow>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Cow deleted successfully',
      data: result,
    });
  }
);

const updateCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const cowId = req.params.id;
    const sellerId = req.user?.userId;
    const updatedData = req.body;
    const result = await CowService.updateCow(cowId, sellerId, updatedData);
    sendResponse<ICow>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Cow updated successfully',
      data: result,
    });
  }
);

export const CowController = {
  postCow,
  getAllCows,
  getSellersCow,
  getSingleCow,
  deleteCow,
  updateCow,
};
