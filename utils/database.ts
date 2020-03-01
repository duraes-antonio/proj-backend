import { Mongoose } from 'mongoose';

export async function clearDatabase(mongoose: Mongoose): Promise<void[]> {
    return await Promise.all(
      Object.keys(mongoose.models).map(async key => {
          await mongoose.models[key].deleteMany({});
      })
    );
}
