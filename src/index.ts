import cluster from 'cluster';
import mongoose from 'mongoose';
import config from './helper/config';
import { Mux } from './framework/mux';
import logger from './helper/logger';
import './middleware';
import './mux/article';
import './mux/echo';
import { GetExpressInstance } from './framework/express';
import FrameworkEvent from './framework/event';

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
    if (cluster.isMaster) {
      logger.info('Master process online pid:', process.pid);
      AppMain.startMaster();
    } else if (config.serviceHost && config.servicePort) {
      logger.info('Service online:', config.serviceHost, 'port:', config.servicePort);
      AppMain.startWorker(config.serviceHost, parseInt(config.servicePort, 10));
    }
  }
}

AppMain.start();
