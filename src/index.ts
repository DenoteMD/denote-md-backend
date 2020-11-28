import express from 'express';
import cluster from 'cluster';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Mux } from './framework/mux';
import logger from './helper/logger';
import './middleware/middleware';
import './mux/article';
import { GetExpressInstance } from './framework/express';

dotenv.config();
const { MONGO_CONNECT_STRING, SERVICE_HOST, SERVICE_PORT, NODE_ENV } = process.env;

class AppMain {
  /**
   * Connect mongodb
   * @static
   * @memberof AppMain
   */
  public static async connectMongo() {
    await mongoose.connect(MONGO_CONNECT_STRING as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  /**
   * Start master
   * @private
   * @static
   * @memberof AppMain
   */
  private static startMaster() {
    // Fork child
    cluster.fork();
  }

  /**
   * Start workers
   * @private
   * @static
   * @param {string} host
   * @param {number} port
   * @memberof AppMain
   */
  private static async startWorker(host: string, port: number) {
    await AppMain.connectMongo();
    const app = GetExpressInstance();

    if (NODE_ENV === 'development') {
      app.use(function DebugMiddleWare(req: express.Request, _res: express.Response, next: Function) {
        logger.debug(`Request to ${req.url} was handled by ${process.pid}`);
        return next();
      });
    }
    Mux.init(NODE_ENV !== 'development');
    logger.info('Service process online pid:', process.pid, 'bind:', host, port);
    app.listen(port, host);
  }

  /**
   * Public start method
   * @memberof AppMain
   */
  public static start() {
    if (cluster.isMaster) {
      logger.info('Master process online pid:', process.pid);
      AppMain.startMaster();
    } else if (SERVICE_HOST && SERVICE_PORT) {
      logger.info('Service online:', SERVICE_HOST, 'port:', SERVICE_PORT);
      AppMain.startWorker(SERVICE_HOST, parseInt(SERVICE_PORT, 10));
    }
  }
}

AppMain.start();
