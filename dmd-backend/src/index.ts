import express from 'express';
import cluster from 'cluster';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MuxServer } from './framework/mux';

class AppMain {
  /**
   * Connect mongodb
   * @static
   * @memberof AppMain
   */
  public static connectMongo() {
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
    MuxServer.get('/', (_req: express.Request, res: express.Response) => {
      res.json({ message: 'Ping Successfull' });
    });
    app.use(express.json());
    app.use(MuxServer);
    app.listen(port, host);
  }

  /**
   * Public start method
   * @memberof AppMain
   */
  public static start() {
    if (cluster.isMaster) {
      AppMain.startMaster();
    } else {
      AppMain.startWoker('127.0.0.1', 8080);
    }
  }
}

AppMain.start();
