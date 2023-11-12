import { IUser } from '../app/modules/auth/auth.interface';
import { ICow } from '../app/modules/cow/cow.interface';
import { IOrder } from '../app/modules/order/order.interface';
import config from '../config';

export const sslData = (
  selectedCow: ICow | null,
  transactionId: string,
  buyer: IUser | null,
  orderData: IOrder,
  discountedPrice?: number,
  couponId?: string
) => {
  const data = {
    total_amount: discountedPrice ? discountedPrice : selectedCow?.price,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${config.server_base_url}/orders/payment-success/${transactionId}?couponId=${couponId}`,
    fail_url: `${config.server_base_url}/orders/payment-failed/${transactionId}`,
    cancel_url: 'http://localhost:3030/cancel',
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: buyer?.name?.firstName + ' ' + buyer?.name?.lastName,
    cus_email: 'customer@example.com',
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: orderData.contactNo,
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: orderData.shippingAddress,
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };
  return data;
};
