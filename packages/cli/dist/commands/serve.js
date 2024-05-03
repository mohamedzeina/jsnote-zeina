"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommand = void 0;
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const local_api_1 = require("local-api");
exports.serveCommand = new commander_1.Command()
    .command('serve [filename]') // watch for serve command in the cmd
    .description('Open a file for editing')
    .option('-p, --port <number>', 'port to run server on', '4005')
    .action((filename = 'notebook.js', options) => {
    // logic of the command
    const dir = path_1.default.join(process.cwd(), path_1.default.dirname(filename)); // getting the directory
    filename = path_1.default.basename(filename); // getting the filename
    (0, local_api_1.serve)(parseInt(options.port), filename, dir);
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
