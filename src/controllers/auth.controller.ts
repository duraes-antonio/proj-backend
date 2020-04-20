'use strict';
import { NextFunction, Request, Response } from 'express';
import { serviceDataMsg, validationErrorMsg as msg } from '../shared/buildMsg';
import { PipelineValidation } from '../shared/validations';
import { userSizes } from '../shared/fieldSize';
import { cryptService as cryptS } from '../services/crypt.service';
import { tokenService as tokenS } from '../services/token.service';
import { TokenData } from '../domain/models/token-data';
import { userRepository } from '../data/repository/user.repository';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { UserAdd } from '../domain/models/user';
import { TokenInvalid } from '../domain/models/token-invalid';
import { TokenInvalidSchema } from '../data/schemas/token.schema';

function validateUser(user: UserAdd): PipelineValidation {
    return new PipelineValidation(msg.empty)
      .validEmail('Email', user.email, msg.invalidFormat)
      .atMaxLen('Senha', user.password, userSizes.passwordMax, msg.maxLen);
}

async function authenticate(req: Request, res: Response):
  Promise<Response | Response<{ token: string; user: TokenData }>> {
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
                  id: user.id,
                  name: user.name,
                  roles: user.roles
              }
          });
    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

async function refreshToken(req: Request, res: Response, next: NextFunction):
  Promise<{ token: string; user: TokenData }> {
    const uInfo: TokenData = await tokenS.decodeFromReq(req);

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return ctrlFunc.post(
      req, res, next,
      async () => {
          const token = tokenS.generate(uInfo);
          return {
              token: token,
              user: {
                  avatarUrl: uInfo.avatarUrl,
                  email: uInfo.email,
                  id: uInfo.email,
                  name: uInfo.name,
                  roles: uInfo.roles
              }
          };
      }
    );
}

async function invalidate(req: Request, res: Response, next: NextFunction):
  Promise<Response> {
    const token = tokenS.extract(req) as string;
    const uInfo: TokenData = await tokenS.decode(token);
    const tokenInv: TokenInvalid = {
        createdAt: new Date(),
        token: token,
        userId: uInfo.id
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return ctrlFunc.post<TokenInvalid>(
      req, res, next, () => repoFunc.create(tokenInv, TokenInvalidSchema)
    );
}

export const authController = {
    authenticate: authenticate,
    invalidateToken: invalidate,
    refreshToken: refreshToken
};
