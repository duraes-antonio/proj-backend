'use strict';
import { Request, Response } from 'express';
import { serviceDataMsg, validationErrorMsg as msg } from '../shared/buildMsg';
import { PipelineValidation } from '../shared/validations';
import { userSizes } from '../shared/fieldSize';
import { cryptService as cryptS } from '../services/crypt.service';
import { tokenService as tokenS } from '../services/tokenService';
import { IUser, IUserSchema } from '../domain/interfaces/user.interface';
import { ITokenData } from '../services/interfaces/tokenData.interface';
import { tokenRepository as tokenRepo } from '../data/repository/token.repository';
import { userRepository } from '../data/repository/user.functions.repository';


function validateUser(user: IUser): PipelineValidation {
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

        const token = tokenS.generate(user as IUserSchema);
        return res.status(200).send({
            token: token,
            user: {
                email: user.email,
                name: user.name
            }
        });
    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

async function refreshToken(req: Request, res: Response) {
    const uInfo: ITokenData = await tokenS.decodeFromReq(req);

    try {
        const token = await tokenS.generate(uInfo);
        return res.status(200).send({
            token: token,
            user: {
                email: uInfo.email,
                name: uInfo.name
            }
        });
    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

async function invalidate(req: Request, res: Response) {
    const token = tokenS.extract(req);

    if (!token) {
        return res.status(401).send(serviceDataMsg.tokenEmpty());
    }

    const uInfo: ITokenData = await tokenS.decode(token);

    try {
        return res.status(200).send(
          await tokenRepo.create({ token, userId: uInfo.id })
        );
    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

export const authController = {
    authenticate: authenticate,
    invalidateToken: invalidate,
    refreshToken: refreshToken
};
