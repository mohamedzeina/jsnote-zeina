import path from 'path';
import { Command } from 'commander';
import { serve } from '@jsnote-zeina/local-api';

interface LocalApiError {
  code: string;
}

const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
  .command('serve [filename]') // Watch for serve command in the cmd
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    const isLocalApiError = (err: any): err is LocalApiError => {
      return typeof err.code === 'string';
    };

    try {
      const dir = path.join(process.cwd(), path.dirname(filename)); // getting the directory
      filename = path.basename(filename); // Getting the filename
      await serve(parseInt(options.port), filename, dir, !isProduction);
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`
      );
    } catch (err) {
      if (isLocalApiError(err))
        if (err.code === 'EADDRINUSE') {
          console.log('Port is in use. Try running on a different port.');
        } else if (err instanceof Error) {
          console.log('Here is the problem: ', err.message);
        }

      process.exit(1); // Exit the program if express server does not start successfully
    }
  });

/*
    -[filename]: specifices that there is an optional filename argument
    that can be provided with the serve command
    -<number>: specifies that if a user provides a port option
    they have to provide a port numer
    -notebook.js is the default file name that is going to save
    the cells of the user in case the user does not provide any
    filename
    -process.cwd() gets the path of the current working directory that
    the terminal is open in 
    -path.dirname gets the relative directory (if any) provided in the
    filename that the user inputs
    


*/
