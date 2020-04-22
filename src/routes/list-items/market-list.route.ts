'use strict';
import { builderListController as builderListCtrl } from '../../controllers/base/builder-list-controller';
import { ListMarketSchema } from '../../data/schemas/list-items/market-list.schema';

const router = builderListCtrl.buildRouter('Lista de Parceiros', ListMarketSchema);
export { router as listMarketsRoutes };
