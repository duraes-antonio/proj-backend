'use strict';

import { NextFunction, Request, Response } from 'express';
import { tokenService } from './tokenService';
import { ITokenData } from './interfaces/tokenData.interface';
import { EUserRole } from '../domain/enum/role.enum';
import { serviceDataMsg } from '../shared/buildMsg';

async function isAdmin(req: Request): Promise<boolean> {
    const data: ITokenData = await tokenService.decodeFromReq(req);
    return data.roles.indexOf(EUserRole.ADMIN) > -1;
}

async function allowAdmin(req: Request, res: Response, next: NextFunction) {
    if (await isAdmin(req)) {
        next();
    } else {
        res.status(403).send(serviceDataMsg.onlyAdmin());
    }
}

export const authService = {
    isAdmin: isAdmin,
    allowAdmin: allowAdmin
};
