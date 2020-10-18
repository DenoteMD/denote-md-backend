import express, { NextFunction } from 'express';
import DenoteUI from 'denote-ui';
import { Mux } from '../framework/mux';

const bodyLength = 1048576;

Mux.use((req: express.Request, res: express.Response, next: NextFunction) => {
  const data = Buffer.alloc(bodyLength);
  let offset = 0;

  // Append data to buffer
  req.on('data', (chunk) => {
    if (Buffer.isBuffer(chunk)) {
      chunk.copy(data, offset);
      offset += chunk.length;
    } else {
      offset += data.write(chunk, offset);
    }
  });

  req.on('end', () => {
    res.setHeader('Content-Type', 'application/json');
    const contentLength = req.header('Content-Length');
    if (typeof contentLength === 'number' && Number.isInteger(contentLength)) {
      const { obj, signer } = DenoteUI.recoverObject(data.toString('utf8'));
      req.body = obj;
      if (req.header('X-Denote-User-Identity') === signer) {
        // Object was signed with valid signature
        next();
      } else {
        // Invalid signed object
        res.send(
          JSON.stringify({
            success: false,
            result: {
              message: 'You are not authenticated',
            },
          }),
        );
        next();
      }
    } else {
      next();
    }
  });
});
