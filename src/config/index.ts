import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  db_uri: process.env.DB_URI,
  env: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_RERESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_RERESH_EXPIRES_IN,
  },
  ssl: {
    storeId: process.env.SSL_STORE_ID,
    storePass: process.env.SSL_STORE_PASS,
  },
  base_url: process.env.SERVER_BASE_URL,
  client_base_url: process.env.CLIENT_BASE_URL,
};
