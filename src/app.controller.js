import { dbConnection } from './DB/connection.js';
import { globalErrorHandler } from './Middleware/error.middleware.js';
import { bookRouter, authorRouter, logsRouter } from './Modules/index.js';
export const bootstrap = async (app, express, PORT) => {
  app.use(express.json());

  await dbConnection(app, PORT);
  app.use('/api/v1/books', bookRouter);
  app.use('/api/v1/authors', authorRouter);
  app.use('/api/v1/logs', logsRouter);

  app.all('/*dummy', async (req, res) => {
    return res.status(404).json({
      status: 404,
      message: 'Route not found',
    });
  });

  app.use(globalErrorHandler);
};
