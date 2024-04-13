import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      //Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });

      //Hadle relative paths in a module (./ or ../)
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
            .href, //Forward slash for the URL constructor to use the relative path of the URL
        };
      });

      //Hadle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
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
