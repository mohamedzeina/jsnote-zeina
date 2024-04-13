import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

//Creating an indexed db with the name 'filecache'
const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }

        // // Check to see if we already fetched this file
        // const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
        //   args.path
        // );

        // // and if it is in the cache, return it immediately
        // if (cachedResult) {
        //   return cachedResult;
        // }

        const { data, request } = await axios.get(args.path);

        const fileType = args.path.match(/.css$/) ? 'css' : 'jsx';

        const escaped = data
          .replace(/\n/g, '') //Find new lines and remove them
          .replace(/"/g, '\\"') //Find double quotes and escape them
          .replace(/'/g, "\\'"); //Find single quotes and escape them

        const contents =
          fileType === 'css'
            ? `
        const style = document.createElement('style');
        style.innerText = '${escaped}';
        document.head.appendChild(style);
        `
            : data;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: contents,
          resolveDir: new URL('./', request.responseURL).pathname, // First argument passed is used to remove the /index.js at the end of the url
        };

        //store it inside the cache
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};

// *********** Caching ***********
/* We could have used local storage to cache the requests but local storage is limited 
   and it might lead up to some requests being emitted. Instead, we will use indexedDB 
   which is slightly more complicated and for that reason, we utilize localforage to 
   make it much easier when using indexedDB 
*/

// *********** ESBuild CSS ***********
/* ES build expects to output two files when loading CSS files. The css files are written 
   in another file than the one containing our JS code. For that reason, we won't be
   using the css loader type.
*/
