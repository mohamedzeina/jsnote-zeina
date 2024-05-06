"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
const express_1 = __importDefault(require("express"));
const serve = (port, filename, dir) => {
    const app = (0, express_1.default)();
    app.use(express_1.default.static('../../local-client/build'));
    // app.use(
    //   createProxyMiddleware({
    //     target: 'http://127.0.0.1:3000',
    //     ws: true, //websocket support
    //   })
    // );
    return new Promise((resolve, reject) => {
        app.listen(port, resolve).on('error', reject);
    });
};
exports.serve = serve;
// if express server starts successfully, resolve function is called and promise is finished
// if something fails, reject function will be called with an error state
