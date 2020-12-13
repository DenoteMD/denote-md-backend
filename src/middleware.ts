import express from 'express';
import cors from 'cors';
import CoreAuthenticator from './core/authenticator';
import logger from './helper/logger';
import Mux from './framework/mux';
import config from './helper/config';

// Use JSON parse in all possible request
Mux.use(express.json());

// Development addition debug
if (config.nodeEnv === 'development') {
  // Add debug middle ware
  Mux.use(function DebugMiddleWare(req: express.Request, _res: express.Response, next: Function) {
    logger.debug(`Request to ${req.url} was handled by ${process.pid}`);
    logger.debug('Request data:', {
      header: { ...req.headers },
      body: { ...req.body },
      query: { ...req.query },
      params: { ...req.params },
    });
    return next();
  });

  // Cors for development with origin: *
  Mux.use(cors());
}

if (config.nodeEnv !== 'development') {
  const corsConfig = config.serviceCors.split(',').map((item: string): string | RegExp => {
    const tmp = item.trim();
    if (tmp.substr(0, 4) === 'http') {
      // If request start with http:// or https:// we will return the URL
      return tmp;
    }
    // Otherwise we return regex
    return new RegExp(tmp, 'i');
  });
  logger.debug('Service cors config:', corsConfig);
  Mux.use(
    cors({
      origin: corsConfig,
      methods: 'GET,PUT,POST,DELETE',
      optionsSuccessStatus: 204,
    }),
  );
}

// Use core authentication middleware with DenoteUI
Mux.use(CoreAuthenticator.authenticationMiddleWare);
