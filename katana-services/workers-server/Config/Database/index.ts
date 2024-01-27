import mongoose from 'mongoose';

import { APP_DATABASE_URI } from '../env';

export default function initDatabase() {
  try {
    mongoose
      .connect(APP_DATABASE_URI, {
        dbName: 'katana-ukbears',
        retryWrites: true,
        writeConcern: {
          w: 'majority',
        },
      })
      .then(() => {
        console.log('MongoDB Database connected');
      });
  } catch (e) {
    console.error(e);
  }
}
