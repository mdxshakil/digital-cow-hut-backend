import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (adminData: IAdmin): Promise<IAdmin | null> => {
  // const createdAdmin = await Admin.create(adminData);
  const newAdmin = new Admin(adminData);
  const createdAdmin = await newAdmin.save();
  return createdAdmin;
};

export const AdminService = {
  createAdmin,
};
