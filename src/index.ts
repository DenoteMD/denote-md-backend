import cluster from 'cluster';
import mongoose from 'mongoose';
import { Mux, GetExpressInstance, FrameworkEvent } from './framework';
import config from './helper/config';
import logger from './helper/logger';
import './middleware';
import './mux';

class AppMain {
  /**
   * Connect mongodb
   * @static
   * @memberof AppMain
   */
  public static async connectMongo() {
    await mongoose.connect(config.mongoConnectString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
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
    Mux.init(config.nodeEnv !== 'development');
    logger.info('Service process online pid:', process.pid, 'bind:', host, port);
    app.listen(port, host);
  }

  /**
   * Public start method
   * @memberof AppMain
   */
  public static start() {
    FrameworkEvent.on('error', (err: Error) => {
      logger.error(err);
    });
    // Development mode single process
    if (config.nodeEnv === 'development') {
      AppMain.startWorker(config.serviceHost, parseInt(config.servicePort, 10));
      return;
    }
    // Production ready mode
    if (cluster.isMaster) {
      logger.info('Master process online pid:', process.pid);
      AppMain.startMaster();
    } else if (config.serviceHost && config.servicePort) {
      AppMain.startWorker(config.serviceHost, parseInt(config.servicePort, 10));
    }
  }
}

AppMain.start();
