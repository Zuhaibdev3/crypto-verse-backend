import { NextFunction, Request, Response, Router } from 'express';

// import { AccessRoutes } from './access/access.routes';
import { IndustryRoutes } from './industry/industry.routes';
import { AccessAppRoutes } from './access/access.app.routes';
import { NotFoundError } from '../../core/ApiError';

export const registerApiRoutes = (router: Router, prefix = '', appRoutesPrefix = '', superAdminPrefix = '', adminPrefix = '', userPrefix = ''): void => {

  router.get(prefix, (req: Request, res: Response) => res.send('❤'));
  // router.use(`${prefix}`, new AccessRoutes().router)
  // router.use(`${appRoutesPrefix}`, new AccessAppRoutes().router)
  router.use(`${prefix}/industry`, new IndustryRoutes().router)

  router.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError()));
}