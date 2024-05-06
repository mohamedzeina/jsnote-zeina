import path from 'path';
import { Command } from 'commander';
import { serve } from 'local-api';

export const serveCommand = new Command()
  .command('serve [filename]') // watch for serve command in the cmd
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action((filename = 'notebook.js', options: { port: string }) => {
    // logic of the command

    const dir = path.join(process.cwd(), path.dirname(filename)); // getting the directory
    filename = path.basename(filename); // getting the filename
    serve(parseInt(options.port), filename, dir);
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
