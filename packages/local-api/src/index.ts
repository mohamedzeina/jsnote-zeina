import express from 'express';

export const serve = (port: number, filename: string, dir: string) => {
  const app = express();

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};
// if express server starts successfully, resolve function is called and promise is finished
// if something fails, reject function will be called with an error state
