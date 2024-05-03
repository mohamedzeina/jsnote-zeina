import { Command } from 'commander';

export const serveCommand = new Command()
  .command('serve') // watch for serve command in the cmd
  .description('Open a file for editing')
  .action(() => {
    // logic of the command
    console.log('Getting ready to serve a file');
  });
