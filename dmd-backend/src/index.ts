import express from 'express';
import cluster from 'cluster';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Mux } from './framework/mux';
import logger from './helper/logger';
import './mux/hello-world';
import Singleton from './helper/express';

dotenv.config();
const {
  MONGO_CONNECT_STRING,
  SERVICE_HOST,
  SERVICE_PORT,
  NODE_ENV,
} = process.env;

class AppMain {
  /**
   * Connect mongodb
   * @static
   * @memberof AppMain
   */
  public static connectMongo() {
    if (MONGO_CONNECT_STRING) {
      mongoose.connect(MONGO_CONNECT_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } else {
      logger.error('Can not connect to mongodb');
      process.exit(1);
    }
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
  private static startWorker(host: string, port: number) {
    // AppMain.connectMongo();
    const app = Singleton.getExpressInstance();
    app.use(express.json());
    Mux.init(NODE_ENV !== 'development');
    logger.info(
      'Service process online pid:',
      process.pid,
      'bind:',
      host,
      port,
    );
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
