'use strict';
import { NextFunction, Request, Response } from 'express';
import { tokenService } from './token.service';
import { EUserRole } from '../domain/enum/role';
import { serviceDataMsg } from '../shared/buildMsg';
import { Message, responseFunctions } from '../controllers/base/response.functions';
import { User } from '../domain/models/user';

function isAdmin(req: Request): boolean {
    const data: User = tokenService.decodeFromReq(req);
    return data.roles.indexOf(EUserRole.ADMIN) > -1;
}

function allowAdmin(req: Request, res: Response, next: NextFunction):
  Response<Message> | void {
    if (isAdmin(req)) {
        next();
    } else {
        return res.status(403).send(serviceDataMsg.onlyAdmin());
    }
}

async function checkIsOwner<T>(
  req: Request, res: Response, entity: T, entityOwnerId: string
): Promise<Response | void> {
    const tokenData: User = tokenService.decodeFromReq(req);

    if (entityOwnerId !== tokenData.id) {
        return responseFunctions.forbidden(res);
    }
    return;
}

export const authService = {
    allowAdmin: allowAdmin,
    checkIsOwner: checkIsOwner,
    isAdmin: isAdmin
};
