import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellsRouter } from './routes/cells';

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  if (useProxy) {
    app.use(
      createProxyMiddleware({
        target: 'http://127.0.0.1:3000',
        ws: true, //websocket support
      })
    );
  } else {
    const packagePath = require.resolve('local-client/build/index.html'); // gets absolute path on user's local machine
    app.use(express.static(path.dirname(packagePath)));
  }

  app.use(createCellsRouter(filename, dir));

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};
/* if express server starts successfully, resolve function is called and promise is finished
   if something fails, reject function will be called with an error state

   added useProxy boolean to seperate the two cases where our execution environment is being used
   case 1: we are in development mode, constantly developing the app, in this case, we want to see
   the changes done on the app instantly so we use the proxy method
   case 2: we are in production mode, user won't have access to a current react app running so we 
   reference production build using express static
*/
