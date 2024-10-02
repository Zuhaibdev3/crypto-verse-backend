import { NextFunction, Request, Response, Router } from 'express';

import { AccessRoutes } from './access/access.routes';
import { IndustryRoutes } from './industry/industry.routes';
import { DalleRoutes } from './dalle/dalle.routes';
import { NotFoundError } from '../../core/ApiError';

export const registerApiRoutes = (router: Router, prefix = '', superAdminPrefix = '', userPrefix = ''): void => {

  router.get(prefix, (req: Request, res: Response) => res.send('❤'));
  router.use(`${userPrefix}`, new AccessRoutes().router)
  router.use(`${prefix}/industry`, new IndustryRoutes().router)
  router.use(`${userPrefix}/dalle`, new DalleRoutes().router)

  router.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError()));
}