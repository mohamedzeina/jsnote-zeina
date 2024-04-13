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
      build.onLoad({ filter: /^index\.js$/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      /* This onLoad has the caching mechanism because we do not want 
         duplicated code in the next two onLoads. If onLoad does not
         find a cached result, it will not return anything so ESbuild
         will proceed and find the next onLoad with a matching filter,
         execute it and try to return an object
      */
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // Check to see if we already fetched this file
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        //If it is in the cache, return it immediately
        if (cachedResult) {
          return cachedResult;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, '') //Find new lines and remove them
          .replace(/"/g, '\\"') //Find double quotes and escape them
          .replace(/'/g, "\\'"); //Find single quotes and escape them

        const contents = `
        const style = document.createElement('style');
        style.innerText = '${escaped}';
        document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: contents,
          resolveDir: new URL('./', request.responseURL).pathname, // First argument passed is used to remove the /index.js at the end of the url
        };

        //store it inside the cache
        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
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
