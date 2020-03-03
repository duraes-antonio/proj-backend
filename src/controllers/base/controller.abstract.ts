'use strict';

import { NextFunction, Request, Response } from 'express';
import { serviceDataMsg as msgS } from '../../shared/buildMsg';
import { PipelineValidation } from '../../shared/validations';
import { IRepository } from '../../data/repository.interface';

export abstract class AController<T> {
    readonly _entity: string;
    readonly _fnValid: (obj: T) => PipelineValidation;
    readonly _repo: IRepository<T>;

    constructor(
      entity: string, fnValidation: (obj: T) => PipelineValidation,
      repository: IRepository<T>
    ) {
        this._entity = entity;
        this._fnValid = fnValidation;
        this._repo = repository;
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const obj = await this._repo.findById(req.params.id);

            if (!obj) {
                return res.status(404).send(
                  msgS.notFound(this._entity, 'id', req.params.id)
                );
            }
            await this._repo.delete(req.params.id);
            return res.status(200).send();
        } catch (err) {
            return res.status(500)
              .send({ ...msgS.unknown(), data: err });
        }
    };

    get = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const objs: T[] = await this._repo.find();
            return res.status(200).send(objs);
        } catch (err) {
            return res.status(500).send(msgS.unknown());
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {

        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).send(
              msgS.notFound(this._entity, 'id', req.params.id)
            );
        }

        try {
            const obj = await this._repo.findById(req.params.id);

            if (!obj) {
                return res.status(404).send(
                  msgS.notFound(this._entity, 'id', req.params.id)
                );
            }
            return res.status(200).send(obj);
        } catch (err) {
            return res.status(500)
              .send({ ...msgS.unknown(), data: err });
        }
    };

    post = async (req: Request, res: Response, next: NextFunction) => {

        const pipe = this._fnValid(req.body);

        if (!pipe.valid) {
            return res.status(400).send(pipe.errors);
        }

        try {
            const obj = await this._repo.create({ ...req.body }, '5e5dcfb81d624d4ec0712d40');
            return res.status(201).send(obj);
        } catch (err) {
            return res.status(500)
              .send({ ...msgS.unknown(), data: err });
        }
    };

    put = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const obj = await this._repo.findById(req.params.id);

            if (!obj) {
                return res.status(404).send(
                  msgS.notFound(this._entity, 'id', req.params.id)
                );
            }

            const pipe = this._fnValid(req.body);

            if (!pipe.valid) {
                return res.status(400).send(pipe.errors);
            }

            await this._repo.update(req.params.id, req.body);
            return res.status(200).send();

        } catch (err) {
            return res.status(500)
              .send({ ...msgS.unknown(), data: err });
        }
    };
}
