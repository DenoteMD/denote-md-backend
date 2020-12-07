import express from 'express';
import CoreAuthenticator from './core/authenticator';
import logger from './helper/logger';
import Mux from './framework/mux';

if (process.env.NODE_ENV === 'development') {
  Mux.use(function DebugMiddleWare(req: express.Request, _res: express.Response, next: Function) {
    logger.debug(`Request to ${req.url} was handled by ${process.pid}`);
    return next();
  });
}

// Use JSON parse in all possible request
Mux.use(express.json());

// Use core authentication middleware with DenoteUI
Mux.use(CoreAuthenticator.authenticationMiddleWare);
