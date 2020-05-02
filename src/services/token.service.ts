'use strict';
import { NextFunction, Request, Response } from 'express';
import { serviceDataMsg } from '../shared/buildMsg';
import { tokenRepository as tokenRepo } from '../data/repository/token.repository';
import { UserDBModel } from '../data/schemas/user.schema';
import { User } from '../domain/models/user';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { EmptyTokenError, ExpiredTokenError, InvalidTokenError } from '../domain/helpers/error';
import { config } from '../config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

function extractToken(req: Request): string | null {
    if (!req) {
        return null;
    }
    return req.headers.authorization || req.body.token || req.query.token || req.headers['x-access-token'];
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = extractToken(req);

    if (token) {
        jwt.verify(
          token,
          config.saltKey,
          async (err: JsonWebTokenError, data: User) => {
              if (err) {
                  res.status(401).send(serviceDataMsg.tokenInvalid());
              } else if (await tokenRepo.find(data.id, token)) {
                  res.status(401).send(serviceDataMsg.tokenExpired());
              } else {
                  next();
              }
          });
    } else {
        res.status(401).send({ message: serviceDataMsg.tokenEmpty() });
    }
}

async function decodeToken(token: string): Promise<User> {
    return await jwt.verify(token, config.saltKey) as User;
}

function decodeTokenReq(req: Request): User {
    const token = extractToken(req);

    if (!token) {
        throw new EmptyTokenError();
    }

    try {
        return jwt.verify(token, config.saltKey) as User;
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            throw new ExpiredTokenError();
        } else {
            throw new InvalidTokenError();
        }
    }
}

function generateToken(data: User | UserDBModel): string {
    if (!config.saltKey) {
        throw new Error('É necessário definir uma chave para a variável SECRET_KEY');
    }
    return jwt.sign(
      {
          id: data.id,
          cpf: data.cpf,
          phone: data.phone,
          codeArea: data.codeArea,
          createdAt: data.createdAt,
          email: data.email,
          name: data.name,
          avatarUrl: data.avatarUrl,
          roles: [...data.roles]
      } as User,
      config.saltKey,
      { expiresIn: 60 * 60 }
    );
}

export const tokenService = {
    verify: verifyToken,
    decode: decodeToken,
    decodeFromReq: decodeTokenReq,
    extract: extractToken,
    generate: generateToken
};
