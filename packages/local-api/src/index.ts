import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';

export const serve = (port: number, filename: string, dir: string) => {
  const app = express();

  const packagePath = require.resolve('local-client/build/index.html'); // gets absolute path on user's local machine
  console.log(packagePath);
  app.use(express.static(path.dirname(packagePath)));

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
