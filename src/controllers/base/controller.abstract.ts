'use strict';

import { Request, Response } from 'express';
import { serviceDataMsg as msgS } from '../../shared/buildMsg';
import { PipelineValidation } from '../../shared/validations';
import { IRepository } from '../../data/repository.interface';

export abstract class AController<T> {
    private readonly _entity: string;
    private readonly _fnValid: (obj: T) => PipelineValidation;
    private readonly _repo: IRepository<T>;

    constructor(
      entity: string, fnValidation: (obj: T) => PipelineValidation,
      repository: IRepository<T>
    ) {
        this._entity = entity;
        this._fnValid = fnValidation;
        this._repo = repository;
    }

    async delete(req: Request, res: Response) {

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
            return res.status(500).send(msgS.unknown());
        }
    }

    async get(req: Request, res: Response) {

        try {
            const objs: T[] = await this._repo.find();
            return res.status(200).send(objs);
        } catch (err) {
            return res.status(500).send(msgS.unknown());
        }
    }

    async getById(req: Request, res: Response) {

        try {
            const obj = await this._repo.findById(req.params.id);

            if (!obj) {
                return res.status(404).send(
                  msgS.notFound(this._entity, 'id', req.params.id)
                );
            }
            return res.status(200).send(obj);
        } catch (err) {
            return res.status(500).send(msgS.unknown());
        }
    }

    async post(req: Request, res: Response) {
        const pipe = this._fnValid(req.body);

        if (!pipe.valid) {
            return res.status(400).send(pipe.errors);
        }

        try {
            const obj = await this._repo.create({ ...req.body });
            return res.status(201).send(obj);
        } catch (err) {
            return res.status(500).send(msgS.unknown());
        }
    }

    async put(req: Request, res: Response) {

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
            return res.status(500).send(msgS.unknown());
        }
    }
}
