'use strict';
import { config } from '../config';
import { NextFunction, Request, Response } from 'express';
import { serviceDataMsg } from '../shared/buildMsg';
import { tokenRepository as tokenRepo } from '../data/repository/token.repository';
import { TokenData } from './interfaces/tokenData.interface';
import { UserDBModel } from '../data/schemas/user.schema';
import { User } from '../domain/interfaces/user.interface';
import { JsonWebTokenError } from 'jsonwebtoken';

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
          async (err: JsonWebTokenError, data: TokenData) => {
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

async function decodeToken(token: string): Promise<TokenData> {
    return await jwt.verify(token, config.saltKey) as TokenData;
}

function decodeTokenReq(req: Request): TokenData {
    const token = extractToken(req);

    if (!token) {
        throw new Error(serviceDataMsg.tokenEmpty());
    }

    return jwt.verify(token, config.saltKey) as TokenData;
}

function generateToken(data: TokenData | UserDBModel | User): string {
    if (!process.env.SECRET_KEY) {
        throw new Error('É necessário definir uma chave para a variável SECRET_KEY');
    }

    return jwt.sign({
          id: data.id,
          email: data.email,
          name: data.name,
          roles: data.roles
      },
      process.env.SECRET_KEY,
      { expiresIn: 60 * 30 }
    );
}

export const tokenService = {
    verify: verifyToken,
    decode: decodeToken,
    decodeFromReq: decodeTokenReq,
    extract: extractToken,
    generate: generateToken
};
