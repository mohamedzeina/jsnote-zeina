import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

//Creating an indexed db with the name 'filecache'
const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const unpkgPathPlugin = (inputCode: string) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        // Case for packages having relative and nested paths
        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href, //Forward slash for the URL constructor to use the relative path of the URL
          };
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

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

// *********** Resolving Unpkg Nested Path *********** //
/* Since unpkg automatically redirects us to the actual path of the package
  when the name of the package is name in the url, there could be cases where
  we end up in a nested folder. For this reason, we added a resolveDir attribute
  that saves the resloved directory of the file that is requiring the new package
*/

// *********** Caching ***********
/* We could have used local storage to cache the requests but local storage is limited 
   and it might lead up to some requests being emitted. Instead, we will use indexedDB 
   which is slightly more complicated and for that reason, we utilize localforage to 
   make it much easier when using indexedDB 
*/
