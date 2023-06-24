import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { IUser } from '../auth/auth.interface';
import { User } from '../user/user.model';

const getMyProfile = async (
  userId: string,
  role: string
): Promise<IUser | IAdmin | null> => {
  let result = null;
  if (role === 'admin') {
    result = await Admin.findOne({ _id: userId });
  }
  if (role === 'buyer' || role === 'seller') {
    result = await User.findOne({ _id: userId });
  }

  return result;
};

export const ProfileService = {
  getMyProfile,
};
