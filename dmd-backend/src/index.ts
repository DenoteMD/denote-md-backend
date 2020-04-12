import express from 'express';
import cluster from 'cluster';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Mux } from './framework/mux';

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
    dotenv.config();
    if (MONGO_CONNECT_STRING) {
      mongoose.connect(MONGO_CONNECT_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } else {
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
    cluster.fork();
    cluster.fork();
  }

  /**
   * Start wokers
   * @private
   * @static
   * @param {string} host
   * @param {number} port
   * @memberof AppMain
   */
  private static startWoker(host: string, port: number) {
    AppMain.connectMongo();
    const app = express();
    app.use(express.json());
    Mux.init(NODE_ENV !== 'development');
    app.listen(port, host);
  }

  /**
   * Public start method
   * @memberof AppMain
   */
  public static start() {
    if (cluster.isMaster) {
      AppMain.startMaster();
    } else if (SERVICE_HOST && SERVICE_PORT) {
      AppMain.startWoker(SERVICE_HOST, parseInt(SERVICE_PORT, 10));
    }
  }
}

AppMain.start();
