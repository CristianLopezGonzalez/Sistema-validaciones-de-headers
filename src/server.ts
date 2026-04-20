import { env } from './config/env';
import { prisma } from './config/database';
import app from './app';

const PORT = env.PORT || 3000;

const server = app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`Server is running on port ${PORT}`);
    console.log('Database connected');
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
});

const gracefulShutdown = async () => {
  console.log('Shutting down server...');

  try {
    await prisma.$disconnect();
    console.log('Database disconnected');
  } catch (err) {
    console.error('Error disconnecting database:', err);
  }

  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
