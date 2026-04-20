import { Request, Response } from 'express';
import { HttpResponse } from '../middlewares/HttpResponse';

const http = new HttpResponse();

export const healthCheck = (req: Request, res: Response) => {
  http.OK(res, {
    status: 'OK',
    message: 'Server is healthy',
    timestamp: Date.now(),
  });
};
