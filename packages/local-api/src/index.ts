import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const serve = (port: number, filename: string, dir: string) => {
  const app = express();

  app.use(express.static('../../local-client/build'));

  // app.use(
  //   createProxyMiddleware({
  //     target: 'http://127.0.0.1:3000',
  //     ws: true, //websocket support
  //   })
  // );

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};
// if express server starts successfully, resolve function is called and promise is finished
// if something fails, reject function will be called with an error state
