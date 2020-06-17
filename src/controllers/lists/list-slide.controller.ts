'use strict';
import { NextFunction, Request, Response } from 'express';
import { List } from '../../domain/models/lists-item/list';
import { listSlideService } from '../../services/list-items/list-slide.service';
import { responseFunctions as responseFn } from '../base/response.functions';
import { handlerUtil } from '../base/handler.util';
import { Slide } from '../../domain/models/lists-item/slide';
import { slideService } from '../../services/list-items/slide.service';

const _delete = async <T>(req: Request, res: Response, next: NextFunction): Promise<Response> =>
  handlerUtil.handlerErrorRequest(res, async () =>
    responseFn.success(res, await listSlideService.delete(req.params.id, slideService.deleteMany))
  );

const _post = async <T>(req: Request, res: Response, next: NextFunction): Promise<Response> =>
  handlerUtil.handlerErrorRequest(res, async () =>
    responseFn.created(res, await listSlideService.create(req.body, slideService.create))
  );

const _get = async <T>(req: Request, res: Response, next: NextFunction): Promise<Response<List<Slide>[]>> =>
  handlerUtil.handlerErrorRequest(res, async () =>
    responseFn.success(res, await listSlideService.find())
  );

const _getById = async <T>(req: Request, res: Response, next: NextFunction): Promise<Response<List<T>>> =>
  handlerUtil.handlerErrorRequest(res, async () =>
    responseFn.success(res, await listSlideService.findById(req.params.id))
  );

const _patch = async <T>(req: Request, res: Response, next: NextFunction): Promise<Response<List<T>>> =>
  handlerUtil.handlerErrorRequest(res, async () =>
    responseFn.success(res, await listSlideService.update(req.params.id, req.body))
  );

export const listSlideController = {
    delete: _delete,
    get: _get,
    getById: _getById,
    post: _post,
    patch: _patch
};
