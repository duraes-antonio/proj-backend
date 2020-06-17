'use strict';
import { Router } from 'express';
import { tokenService as tokenS } from '../../services/token.service';
import { authService as authS } from '../../services/auth.service';
import { slideController as slideCtrl } from '../../controllers/lists/slide.controller';
import { paths } from '../../shared/consts/path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const multer = require('multer');
const router = Router();
const upload = multer({ dest: paths.imageUpload });

router.delete('/:id', [tokenS.verify, authS.allowAdmin], slideCtrl.delete);
router.post('/', [tokenS.verify, authS.allowAdmin], slideCtrl.post);
router.patch('/:id', [tokenS.verify, authS.allowAdmin], slideCtrl.patch);
router.patch(
  '/:id/image',
  [upload.single('image'), tokenS.verify, authS.allowAdmin],
  slideCtrl.patchImage
);

export { router as slideRoutes };
