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
exports.createCellsRouter = void 0;
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const defaultCells = [
    {
        content: 'JSNote-Zeina\n----------\nThis is an interactive coding environment. You can write Javascript, see it executed, and write coprehensive documentation using markdown.\n\n- Click any text cell (including this one) to edit it\n- The code in each code editor is all joined into one file. If you define a variable in cell #1, you can refer to it in any following code cell!\n- You can show any React component, string, number, or anything else by calling the `show `function. This is a function built into this environment. Call show multiple times to show multiple values\n- Re-order or delete cells using the buttons on the top right \n- Add new cells by hovering on the divider between each cell\n\nAll of your changes get saved to the file you opened Jbook with. So if you ran `npx jsnote-zeina serve test.js` , all of the text and code you write will be saved to the `test.js` file.',
        type: 'text',
        id: 'ohbrr',
    },
    {
        content: "import { useState } from 'react';\r\nconst Counter = () => {\r\n  const [count, setCount] = useState(0);\r\n  return (\r\n    <div>\r\n      <button onClick={() => setCount(count + 1)}>Click </button>\r\n      <h3>Count: {count} </h3>\r\n    </div>\r\n  );\r\n};\r\n\r\nshow(<Counter />);",
        type: 'code',
        id: 'yvorb',
    },
    {
        content: 'const App = () => {\r\n  return (\r\n    <div>\r\n      <h3> App says Hello </h3>\r\n      <i> Counter component will be rendered below... </i>\r\n      <hr />\r\n      {/* Counter was declared in an earlier cell -\r\n  We can reference it here! */}\r\n      <Counter />\r\n    </div>\r\n  );\r\n};\r\n\r\nshow(<App />);',
        type: 'code',
        id: 'toeeq',
    },
];
const createCellsRouter = (filename, dir) => {
    const router = express_1.default.Router();
    router.use(express_1.default.json());
    const fullPath = path_1.default.join(dir, filename);
    router.get('/cells', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const isLocalApiError = (err) => {
            return typeof err.code === 'string';
        };
        try {
            // Read the file
            const result = yield promises_1.default.readFile(fullPath, { encoding: 'utf-8' });
            res.send(JSON.parse(result));
        }
        catch (err) {
            if (isLocalApiError(err)) {
                if (err.code === 'ENOENT') {
                    // Create a file and add default cells
                    const newFile = yield promises_1.default.writeFile(fullPath, JSON.stringify(defaultCells), 'utf-8');
                    res.send(JSON.stringify(defaultCells));
                }
                else {
                    throw err;
                }
            }
        }
        // If read throws an error
        // Insprect the error, see if it says that file doesn't exist
        // Parse a list of cells out of it
        // Send list of cells back to browser
    }));
    router.post('/cells', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Take the list of cells from the request obj
        // Serialize them
        const { cells } = req.body;
        // Write cells into the file
        yield promises_1.default.writeFile(fullPath, JSON.stringify(cells), 'utf-8');
        res.send({ status: 'ok' });
    }));
    return router;
};
exports.createCellsRouter = createCellsRouter;
