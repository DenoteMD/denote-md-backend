import express from 'express';

let MuxRouter: express.Router | undefined;

export function MuxRouterInstance(): express.Router {
  if (!MuxRouter) {
    MuxRouter = express.Router();
  }
  return MuxRouter;
}

export class MuxServer {

}

export default MuxServer;
