import { app } from './app';
import { connectToMongo } from './infrastructure/database/mongo';

const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  try {
    await connectToMongo();

    app.listen(PORT, () => {
      console.log(`Technical Assessment API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Technical Assessment API', error);
    process.exit(1);
  }
}

void startServer();