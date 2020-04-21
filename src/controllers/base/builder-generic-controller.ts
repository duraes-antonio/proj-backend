'use strict';
import { NextFunction, Request, Response } from 'express';
import { Document, Model } from 'mongoose';
import { controllerFunctions as ctrlFn } from './controller.functions';
import { repositoryFunctions as repoFn } from '../../data/repository.functions';
import { FilterBasic } from '../../domain/models/filters/filter-basic';
import { PipelineValidation } from '../../shared/validations';

const _delete = <T>(
  req: Request, res: Response, next: NextFunction,
  schema: Model<Document & T>, entityName: string
): Promise<Response> => {
    return ctrlFn.delete<T>(
      req, res, next, entityName,
      (id: string) => repoFn.delete(id, schema)
    );
};

const get = <T>(
  req: Request, res: Response, next: NextFunction,
  schema: Model<Document & T>, entityName: string
): Promise<Response<T[]>> => {
    return ctrlFn.get<T>(
      req, res, next,
      (f: FilterBasic) => repoFn.find(schema, f)
    );
};

const getById = <T>(
  req: Request, res: Response, next: NextFunction,
  schema: Model<Document & T>, entityName: string
): Promise<Response<T>> => {
    return ctrlFn.getById<T>(
      req, res, next, entityName,
      (id: string) => repoFn.findById(id, schema)
    );
};

const post = <T>(
  req: Request, res: Response, next: NextFunction,
  schema: Model<Document & T>, validationFn: (data: T) => PipelineValidation
): Promise<Response<T>> => {
    return ctrlFn.post<T>(
      req, res, next,
      (data: T) => repoFn.create(data, schema),
      validationFn
    );
};

const patch = <T>(
  req: Request, res: Response, next: NextFunction,
  schema: Model<Document & T>, validationFn: (data: T) => PipelineValidation,
  entityName: string, allowFieldsName: string[]
): Promise<Response<T>> => {
    return ctrlFn.patch<T>(
      req, res, next, entityName, validationFn,
      (id: string, data: T) => repoFn.findAndUpdate(id, data, schema),
      allowFieldsName
    );
};

export const builderGenericController = {
    delete: _delete,
    get,
    getById,
    patch,
    post
};
