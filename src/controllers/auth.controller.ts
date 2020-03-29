'use strict';
import { NextFunction, Request, Response } from 'express';
import { serviceDataMsg, validationErrorMsg as msg } from '../shared/buildMsg';
import { PipelineValidation } from '../shared/validations';
import { userSizes } from '../shared/fieldSize';
import { cryptService as cryptS } from '../services/crypt.service';
import { tokenService as tokenS } from '../services/tokenService';
import { TokenData } from '../services/interfaces/tokenData.interface';
import { userRepository } from '../data/repository/user.repository';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { UserAdd } from '../domain/interfaces/user.interface';
import { TokenInvalid } from '../domain/interfaces/tokenInvalid.interface';
import { TokenInvalidSchema } from '../data/schemas/token.schema';

function validateUser(user: UserAdd): PipelineValidation {
    return new PipelineValidation(msg.empty)
      .validEmail('Email', user.email, msg.invalidFormat)
      .atMaxLen('Senha', user.password, userSizes.passwordMax, msg.maxLen);
}

async function authenticate(req: Request, res: Response) {
    const pipe = validateUser(req.body);

    if (!pipe.valid) {
        return res.status(400).send(pipe.errors);
    }

    try {
        const user = await userRepository.findByEmail(req.body.email);

        if (!user) {
            return res.status(404).send(
              serviceDataMsg.notFound('Usuário', 'email', req.body.email)
            );
        } else if (!(await cryptS.compare(req.body.password, user.password))) {
            return res.status(403).send(serviceDataMsg.wrongPassword());
        }

        const token = tokenS.generate(user);
        return res.status(200)
          .send({
              token: token,
              user: {
                  avatarUrl: user.avatarUrl,
                  email: user.email,
                  name: user.name,
                  roles: user.roles
              }
          });
    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

async function refreshToken(req: Request, res: Response, next: NextFunction) {
    const uInfo: TokenData = await tokenS.decodeFromReq(req);

    return ctrlFunc.post(
      req, res, next,
      async () => {
          const token = tokenS.generate(uInfo);
          return {
              token: token,
              user: {
                  email: uInfo.email,
                  name: uInfo.name
              }
          };
      }
    );
}

async function invalidate(req: Request, res: Response, next: NextFunction) {
    const token = tokenS.extract(req);

    if (!token) {
        return res.status(401).send(serviceDataMsg.tokenEmpty());
    }

    const uInfo: TokenData = await tokenS.decode(token);
    const tokenInv: TokenInvalid = {
        createdAt: new Date(),
        token: token,
        userId: uInfo.id
    };

    return ctrlFunc.post<TokenInvalid>(
      req, res, next, () => repoFunc.create(tokenInv, TokenInvalidSchema)
    );
}

export const authController = {
    authenticate: authenticate,
    invalidateToken: invalidate,
    refreshToken: refreshToken
};
