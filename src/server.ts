import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';

let server: Server;
async function dbConnectAndConquer() {
  try {
    await mongoose.connect(config.db_uri as string);
    console.info('Db Connected 💾');

    server = app.listen(config.port, () => {
      console.info(`Server is running on port ${config.port} 🚀`);
    });
  } catch (error) {
    console.error('Failed to connect', error);
  }

  //terminate server gracefully after any unhandled rejection occurs
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        console.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

dbConnectAndConquer();

process.on('SIGTERM', () => {
  console.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});
