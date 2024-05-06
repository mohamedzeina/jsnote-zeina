"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommand = void 0;
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const local_api_1 = require("local-api");
const isProduction = process.env.NODE_ENV === 'production';
exports.serveCommand = new commander_1.Command()
    .command('serve [filename]') // Watch for serve command in the cmd
    .description('Open a file for editing')
    .option('-p, --port <number>', 'port to run server on', '4005')
    .action((...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filename = 'notebook.js', options) {
    const isLocalApiError = (err) => {
        return typeof err.code === 'string';
    };
    try {
        const dir = path_1.default.join(process.cwd(), path_1.default.dirname(filename)); // getting the directory
        filename = path_1.default.basename(filename); // Getting the filename
        yield (0, local_api_1.serve)(parseInt(options.port), filename, dir, !isProduction);
        console.log(`Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`);
    }
    catch (err) {
        if (isLocalApiError(err))
            if (err.code === 'EADDRINUSE') {
                console.log('Port is in use. Try running on a different port.');
            }
            else if (err instanceof Error) {
                console.log('Here is the problem: ', err.message);
            }
        process.exit(1); // Exit the program if express server does not start successfully
    }
}));
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
