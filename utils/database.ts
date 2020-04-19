import { Mongoose } from 'mongoose';
import { App } from '../src/app';

export async function clearDatabase(mongoose: Mongoose): Promise<void[]> {
    return await Promise.all(
      Object.keys(mongoose.models).map(async key => {
          await mongoose.models[key].deleteMany({});
      })
    );
}

export const closeConnection = (app: App): void => {
    app.databaseInstance.then((db) => {
        db.disconnect();
    });
};
