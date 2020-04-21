'use strict';
import { NextFunction, Request, Response } from 'express';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { responseFunctions as resFunc, responseFunctions as respFunc } from './base/response.functions';
import { userRepository } from '../data/repository/user.repository';
import { cryptService } from '../services/crypt.service';
import { tokenService } from '../services/token.service';
import { User, UserAdd } from '../domain/models/user';
import { UserSchema } from '../data/schemas/user.schema';
import { userService } from '../services/user.service';
import { TokenData } from '../domain/models/token-data';

const entityName = 'Usuário';

type TokenReturn = { token: string; user: User };

function sendToken(res: Response, user: User): Response<TokenReturn> {
    const token = tokenService.generate(user);
    res.setHeader('Authorization', token);
    return respFunc.created(res, { token, user });
}

async function get(req: Request, res: Response, next: NextFunction): Promise<Response<User[]>> {
    return ctrlFunc.get<User>(
      req, res, next, () => repoFunc.find<User>(UserSchema)
    );
}

async function getById(req: Request, res: Response, next: NextFunction): Promise<Response<User>> {
    return ctrlFunc.getById<User>(
      req, res, next, entityName,
      (id: string) => repoFunc.findById<User>(id, UserSchema)
    );
}

async function post(req: Request, res: Response, next: NextFunction): Promise<Response> {

    const pipe = userService.validate(req.body);

    if (!pipe.valid) {
        return resFunc.badRequest(res, pipe.errors);
    }

    if (await userRepository.hasWithEmail(req.body.email)) {
        return respFunc.duplicated(res, entityName, 'Email', req.body.email);
    }

    const user: User = {
        ...req.body,
        password: await cryptService.encrypt(req.body.password)
    };

    const objSaved = await ctrlFunc.postAndReturnCreated<User>(
      req, res, next,
      async () => await repoFunc.create<User>(user, UserSchema)
    );
    return sendToken(res, objSaved);
}

async function patch(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const dataToken: TokenData = tokenService.decodeFromReq(req);
    return ctrlFunc.patch<UserAdd>(
      req, res, next, entityName,
      (data) => userService.validate(data, true),
      (_, payload) =>
        repoFunc.findAndUpdate(dataToken.id, payload, UserSchema),
      ['avatarUrl', 'name', 'password', 'roles']
    );
}

export const userController = {
    get,
    getById,
    post,
    patch
};
