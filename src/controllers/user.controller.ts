'use strict';
import { NextFunction, Request, Response } from 'express';
import { validationErrorMsg as msgServ } from '../shared/buildMsg';
import { PipelineValidation } from '../shared/validations';
import { userSizes } from '../shared/fieldSize';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { responseFunctions as resFunc, responseFunctions as respFunc } from './base/response.functions';
import { userRepository } from '../data/repository/user.repository';
import { cryptService } from '../services/crypt.service';
import { tokenService } from '../services/token.service';
import { User, UserAdd } from '../domain/models/user';
import { UserSchema } from '../data/schemas/user.schema';

const entityName = 'Usuário';

function validatePost(user: UserAdd): PipelineValidation {
    return new PipelineValidation()
      .atMaxLen('Nome', user.name, userSizes.nameMax, msgServ.maxLen)
      .validEmail('Email', user.email, msgServ.invalidFormat)
      .atMaxLen('Senha', user.password, userSizes.passwordMax, msgServ.maxLen);
}

/*
function validatePut(user: User): PipelineValidation {
    return new PipelineValidation()
      .atMaxLen('Nome', user.name, userSizes.nameMax, msgServ.maxLen)
      .atMaxLen('Senha', user.password, userSizes.passwordMax, msgServ.maxLen);
}*/

function sendToken(res: Response, user: User): Response<{ token: string; user: User }> {
    const token = tokenService.generate(user);
    return respFunc.created(res, { token, user });
}

async function post(req: Request, res: Response, next: NextFunction): Promise<Response> {

    const pipe = validatePost(req.body);

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

    const objSaved = await ctrlFunc.post<User>(
      req, res, next,
      async () => await repoFunc.create<User>(user, UserSchema),
      undefined,
      false
    );
    return sendToken(res, objSaved as User);
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

/*
async function put(req: Request, res: Response, next: NextFunction) {
    const putObj = {
        name: req.body.name,
        password: req.body.password,
        avatarUrl: req.body.avatarUrl,
    };
    return ctrlFunc.put<User>(
      req, res, next, entityName, putObj, validatePut,
      (id: string, obj: User) => repoFunc.update<User>(id, obj, UserSchema)
    );
}*/

export const userController = {
    get: get,
    getById: getById,
    post: post
};
