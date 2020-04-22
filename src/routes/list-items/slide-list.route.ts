'use strict';
import { builderListController as builderListCtrl } from '../../controllers/base/builder-list-controller';
import { ListSlideSchema } from '../../data/schemas/list-items/slide-list.schema';

const router = builderListCtrl.buildRouter('Lista de Slides', ListSlideSchema);
export { router as listSlidesRoutes };
