"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommand = void 0;
const commander_1 = require("commander");
exports.serveCommand = new commander_1.Command()
    .command('serve') // watch for serve command in the cmd
    .description('Open a file for editing')
    .action(() => {
    // logic of the command
    console.log('Getting ready to serve a file');
});
