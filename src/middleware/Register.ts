import express, { Router } from 'express';
import cors from "cors";
import helmet from "helmet";
import compression from "compression"
import cookieParser from "cookie-parser";
import passport from 'passport';

const registerMiddleware = (router: Router): void => {
  router.use(cors({ origin: '*' }));
  router.use(helmet());
  router.use(compression());
  router.use(express.json());
  router.use(cookieParser());
  router.use(passport.initialize());
}

export default registerMiddleware
