'use strict';
import { NextFunction, Request, Response } from 'express';
import { responseFunctions as responseFn } from '../base/response.functions';
import { handlerUtil } from '../base/handler.util';
import { slideService } from '../../services/list-items/slide.service';
import { Slide } from '../../domain/models/lists-item/slide';

const _delete = async <T>(req: Request, res: Response, next: NextFunction): Promise<Response> =>
  handlerUtil.handlerErrorRequest(res, async () =>
    responseFn.success(res, await slideService.delete(req.params.id))
  );

const _post = async <T>(req: Request, res: Response, next: NextFunction): Promise<Response<Slide>> =>
  handlerUtil.handlerErrorRequest(res, async () =>
    responseFn.created(res, await slideService.create(req.body))
  );

const _patch = async <T>(req: Request, res: Response, next: NextFunction): Promise<Response<Slide>> =>
  handlerUtil.handlerErrorRequest(res, async () =>
    responseFn.success(res, await slideService.update(req.params.id, req.body))
  );

const _patchImage = async <T>(req: Request, res: Response, next: NextFunction): Promise<Response<Slide>> =>
  handlerUtil.handlerErrorRequest(res, async () =>
    responseFn.success(res, await slideService.updateImage(req.params.id, req.file))
  );


export const slideController = {
    delete: _delete,
    post: _post,
    patch: _patch,
    patchImage: _patchImage
};
