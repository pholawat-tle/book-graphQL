/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';

export function healthCheck(req: Request, res: Response, next: NextFunction) {
  return res.status(200).json({ message: 'ok' })
}
