import mongoose, { ConnectOptions, Connection } from "mongoose";

interface MongooseOptions extends ConnectOptions {
  useNewUrlParser?: boolean;
}

class Database {
  static async start(uri: string) {
    await Database.connect(uri);
  }
  private static async connect(uri: string): Promise<void> {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as MongooseOptions);
    } catch (error) {
      console.log("some error", error.message);
    }
  }

  static async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log("Database disconnected successfully!");
  }
  static connection(): Connection {
    return mongoose.connection;
  }
}

export default Database;
