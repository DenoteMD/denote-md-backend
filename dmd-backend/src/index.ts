import express from 'express';
import cluster from 'cluster';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

/**
 * Main Application
 * @export
 * @class AppMain
 */
class AppMain {

  /**
   *Creates an instance of AppMain.
   * @param {string} connectString
   * @memberof AppMain
   */
  constructor() {
    dotenv.config();
    if (process.env.MONGO_CONNECT_STRING) {
      mongoose.connect(process.env.MONGO_CONNECT_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } else {
      process.exit(1);
    }
  }

  /**
   * Start Master
   * @private
   * @memberof AppMain
   */
  private startMaster() {
    cluster.fork();
    cluster.fork();
  }

  /**
   * Start workers
   * @private
   * @param {string} host
   * @param {number} port
   * @memberof AppMain
   */
  private startSlave(host: string, port: number) {
    const app = express();
    app.use(express.json());
    app.listen(port, host);
  }

  /**
   * Public start method
   * @memberof AppMain
   */
  public start() {
    if (cluster.isMaster) {
      this.startMaster();
    } else {
      this.startSlave('127.0.0.1', 8080);
    }
  }
}

const instanceMain = new AppMain();
instanceMain.start();