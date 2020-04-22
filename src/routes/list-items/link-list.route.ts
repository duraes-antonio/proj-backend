'use strict';
import { builderListController as builderListCtrl } from '../../controllers/base/builder-list-controller';
import { ListLinkSchema } from '../../data/schemas/list-items/link-list.schema';

const router = builderListCtrl.buildRouter('Lista de Links', ListLinkSchema);
export { router as listLinksRoutes };
