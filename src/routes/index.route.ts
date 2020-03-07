'use strict';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

router.get(
  '/',
  (req: Request, res: Response) => {
      res.status(200).send({
          title: 'Node JS - API',
          version: '1.0'
      });
  });

export async function postx(req: Request, res: Response, next: NextFunction) {
    return res.status(200).send({
        title: 'Node JS - API',
        version: '1.0'
    });
}

export { router as indexRoutes };
