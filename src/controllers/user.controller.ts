'use strict';
import { NextFunction, Request, Response } from 'express';
import { controllerFunctions as ctrlFunc, extractFilter } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { responseFunctions as respFunc } from './base/response.functions';
import { userRepository } from '../data/repository/user.repository';
import { cryptService } from '../services/crypt.service';
import { tokenService } from '../services/token.service';
import { User, UserAdd, UserSearch } from '../domain/models/user';
import { UserSchema } from '../data/schemas/user.schema';
import { userService } from '../services/user.service';

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

async function search(req: Request, res: Response, next: NextFunction): Promise<Response<UserSearch>> {
    try {
        return res.status(200).send(await userService.search(extractFilter(req)));
    } catch (e) {
        return res.status(e.code ?? 500).send(e.messages ?? e.message);
    }
}

async function post(req: Request, res: Response, next: NextFunction): Promise<Response> {

    const pipe = userService.validate(req.body);

    if (!pipe.valid) {
        return respFunc.badRequest(res, pipe.errors);
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
    const dataToken: User = tokenService.decodeFromReq(req);
    return ctrlFunc.patch<UserAdd>(
      req, res, next, entityName,
      (data) => userService.validate(data, true),
      (_, payload) =>
        repoFunc.findAndUpdate(dataToken.id, payload, UserSchema),
      ['avatarUrl', 'name', 'password', 'roles']
    );
}

async function patchRoles(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
        const roles = req.body;
        return respFunc.success(res, await userService.update(req.params.id, { roles }));
    } catch (e) {
        return res.status(e.code ?? 500).send(e.messages ?? e.message);
    }
}

export const userController = {
    get,
    getById,
    post,
    patch,
    patchRoles,
    search
};
