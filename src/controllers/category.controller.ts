'use strict';
import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { ICategory } from '../domain/interfaces/category.interface';
import { categorySizes } from '../shared/fieldSize';
import { AController } from './base/controller.abstract';
import { CategoryRepository } from '../data/repository/category.repository';

export const entityName = 'Categoria';

function validateCategory(cat: ICategory): PipelineValidation {
    return new PipelineValidation(msg.empty)
      .atMaxLen('Título', cat.title, categorySizes.titleMax, msg.maxLen);
}

// async function delete_(req: Request, res: Response) {
//
//     try {
//         const cat: ICategorySchema = await catRepo.findBydId(req.params.id);
//
//         if (!cat) {
//             return res.status(404).send(
//               serviceDataMsg.notFound(entityName, 'id', req.params.id)
//             );
//         }
//
//         await catRepo.delete(req.params.id);
//         return res.status(200).send();
//     } catch (err) {
//         return res.status(500).send(serviceDataMsg.unknown());
//     }
// }
//
// async function get(req: Request, res: Response) {
//
//     try {
//         const categories = await catRepo.find();
//         return res.status(200).send(categories);
//     } catch (err) {
//         return res.status(500).send(serviceDataMsg.unknown());
//     }
// }
//
// async function getById(req: Request, res: Response) {
//
//     try {
//         const cat = await catRepo.findBydId(req.params.id);
//
//         if (!cat) {
//             return res.status(404).send(
//               serviceDataMsg.notFound(entityName, 'id', req.params.id)
//             );
//         }
//         return res.status(200).send(cat);
//     } catch (err) {
//         return res.status(500).send(serviceDataMsg.unknown());
//     }
// }
//
// async function post(req: Request, res: Response) {
//     const pipe = validateProduct(req.body);
//
//     if (!pipe.valid) {
//         return res.status(400).send(pipe.errors);
//     }
//
//     try {
//         const data = await catRepo.create({
//             ...req.body
//         });
//         return res.status(201).send(data);
//     } catch (err) {
//         return res.status(500).send(serviceDataMsg.unknown());
//     }
// }
//
// async function put(req: Request, res: Response) {
//
//     try {
//         const cat: ICategorySchema = await catRepo.findBydId(req.params.id);
//
//         if (!cat) {
//             return res.status(404).send(
//               serviceDataMsg.notFound(entityName, 'id', req.params.id)
//             );
//         }
//
//         const pipe = validateProduct(req.body);
//
//         if (!pipe.valid) {
//             return res.status(400).send(pipe.errors);
//         }
//
//         await catRepo.put(req.params.id, req.body);
//         return res.status(200).send();
//
//     } catch (err) {
//         return res.status(500).send(serviceDataMsg.unknown());
//     }
// }
//
// export const categoryController = {
//     delete: delete_,
//     get: get,
//     getById: getById,
//     post: post,
//     put: put
// };

export class CategoryController extends AController<ICategory> {

    constructor() {
        super(entityName, validateCategory, new CategoryRepository());
    }
}

export const categoryController = new CategoryController();
