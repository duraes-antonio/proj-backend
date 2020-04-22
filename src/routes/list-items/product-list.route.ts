'use strict';
import { builderListController as builderListCtrl } from '../../controllers/base/builder-list-controller';
import { ListProductSchema } from '../../data/schemas/list-items/product-list.schema';

const router = builderListCtrl.buildRouter('Lista de Produtos', ListProductSchema);
export { router as listProductsRoutes };
