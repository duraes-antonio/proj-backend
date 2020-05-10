'use strict';
import { NextFunction, Request, Response, Router } from 'express';
import { tokenService as tokenS } from '../../services/token.service';
import { authService } from '../../services/auth.service';
import { listController } from '../lists/list.controller';
import { Document, Model } from 'mongoose';
import { List } from '../../domain/models/lists-item/list';

const buildRouter = <T>(entityName: string, schema: Model<Document & List<T>>): Router => {
    const router = Router();

    router.delete(
      '/:id', [tokenS.verify, authService.allowAdmin],
      (req: Request, res: Response, next: NextFunction) =>
        listController.delete(req, res, next, entityName, schema)
    );
    router.get(
      '/',
      (req: Request, res: Response, next: NextFunction) =>
        listController.get(req, res, next, entityName, schema)
    );
    router.get(
      '/:id',
      (req: Request, res: Response, next: NextFunction) =>
        listController.getById(req, res, next, entityName, schema)
    );
    router.post(
      '/', [tokenS.verify, authService.allowAdmin],
      (req: Request, res: Response, next: NextFunction) =>
        listController.post(req, res, next, entityName, schema)
    );
    router.patch(
      '/:id', [tokenS.verify, authService.allowAdmin],
      (req: Request, res: Response, next: NextFunction) =>
        listController.patch(req, res, next, entityName, schema)
    );
    return router;
};

export const builderListController = {
    buildRouter
};
