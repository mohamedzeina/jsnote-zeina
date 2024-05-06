"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const path_1 = __importDefault(require("path"));
const cells_1 = require("./routes/cells");
const serve = (port, filename, dir, useProxy) => {
    const app = (0, express_1.default)();
    if (useProxy) {
        app.use((0, http_proxy_middleware_1.createProxyMiddleware)({
            target: 'http://127.0.0.1:3000',
            ws: true, //websocket support
        }));
    }
    else {
        const packagePath = require.resolve('local-client/build/index.html'); // gets absolute path on user's local machine
        app.use(express_1.default.static(path_1.default.dirname(packagePath)));
    }
    app.use((0, cells_1.createCellsRouter)(filename, dir));
    return new Promise((resolve, reject) => {
        app.listen(port, resolve).on('error', reject);
    });
};
exports.serve = serve;
/* if express server starts successfully, resolve function is called and promise is finished
   if something fails, reject function will be called with an error state

   added useProxy boolean to seperate the two cases where our execution environment is being used
   case 1: we are in development mode, constantly developing the app, in this case, we want to see
   the changes done on the app instantly so we use the proxy method
   case 2: we are in production mode, user won't have access to a current react app running so we
   reference production build using express static
*/
