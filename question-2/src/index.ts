import 'dotenv/config';
import app from './app';
import Database from './config/database.config';

const start = async () => {
  try {
    await Database.connect();
    await app.listen({ port: Number(process.env.APP_PORT ?? 3000), host: '0.0.0.0' });
    app.swagger();

    console.log('Server running on port 3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
