import { Db, MongoClient } from 'mongodb';

let client: MongoClient | null = null;
let database: Db | null = null;

export async function connectToMongo(): Promise<Db> {
  if (database) {
    return database;
  }

  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (!databaseName) {
    throw new Error('MONGODB_DB_NAME is not defined');
  }

  client = new MongoClient(uri);

  await client.connect();

  database = client.db(databaseName);

  await database.command({ ping: 1 });

  await connectToMongo()

  console.info(
    JSON.stringify({
      event: 'database.connected',
      database: 'MongoDB',
      status: 'SUCCESS',
    }),
  )

  return database;
}

export function getDatabase(): Db {
  if (!database) {
    throw new Error('MongoDB has not been connected');
  }

  return database;
}