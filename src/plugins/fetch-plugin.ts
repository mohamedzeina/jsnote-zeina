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

        // Check to see if we already fetched this file
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // and if it is in the cache, return it immediately
        if (cachedResult) {
          return cachedResult;
        }

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
