'use strict';
import { NextFunction, Request, Response } from 'express';
import { validationErrorMsg as msgServ } from '../shared/buildMsg';
import { IUser } from '../domain/interfaces/user.interface';
import { PipelineValidation } from '../shared/validations';
import { userSizes } from '../shared/fieldSize';
import { controllerFunctions as ctrlFunc } from './base/controller.abstract';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { responseFunctions as resFunc, responseFunctions as respFunc } from './base/responseFunctions';
import { User } from '../data/schemas/user.schema';
import { userRepository } from '../data/repository/user.functions.repository';
import { cryptService } from '../services/crypt.service';
import { tokenService } from '../services/tokenService';

const entityName = 'Usuário';

function validateUser(user: IUser): PipelineValidation {
    return new PipelineValidation()
      .atMaxLen('Nome', user.name, userSizes.nameMax, msgServ.maxLen)
      .validEmail('Email', user.email, msgServ.invalidFormat)
      .atMaxLen('Senha', user.password, userSizes.passwordMax, msgServ.maxLen);
}

async function sendToken(res: Response, user: any) {
    const token = await tokenService.generate(user);
    return respFunc.created(
      res,
      {
          token: token,
          user: {
              email: user.email,
              name: user.name,
              roles: user.roles
          }
      }
    );
}

async function post(req: Request, res: Response, next: NextFunction) {

    const pipe = validateUser(req.body);

    if (!pipe.valid) {
        return resFunc.badRequest(res, pipe.errors);
    }

    if (await userRepository.hasWithEmail(req.body.email)) {
        return respFunc.duplicated(res, entityName, 'Email', req.body.email);
    }

    const user: IUser = {
        ...req.body,
        password: await cryptService.encrypt(req.body.password)
    };

    await ctrlFunc.post<IUser>(
      req, res, next,
      () => repoFunc.create<IUser>(user, User),
      undefined,
      (objSaved) => sendToken(res, objSaved as IUser)
    );
}

async function get(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.get<IUser>(
      req, res, next, ({}) => repoFunc.find<IUser>(User)
    );
}

async function getById(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.getById<IUser>(
      req, res, next, (id: string) => repoFunc.findById<IUser>(id, User)
    );
}

async function put(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.put<IUser>(
      req, res, next, validateUser,
      (id: string, obj: IUser) => repoFunc.update<IUser>(id, obj, User)
    );
}

export const userController = {
    get: get,
    getById: getById,
    post: post,
    put: put
};
