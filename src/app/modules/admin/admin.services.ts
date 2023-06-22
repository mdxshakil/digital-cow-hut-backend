import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (adminData: IAdmin): Promise<IAdmin | null> => {
  const createdAdmin = await Admin.create(adminData);
  return createdAdmin;
};

export const AdminService = {
  createAdmin,
};
