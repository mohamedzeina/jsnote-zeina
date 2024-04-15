import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin';
import { fetchPlugin } from '../plugins/fetch-plugin';

let service: esbuild.Service;

export default async (rawCode: string) => {

  if (!service) { // if esbuild service wasn't started
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  } // only needs to start once so we don't need to start it everytime this component gets called

  const result = await service.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)], // plugins are ran from left to right
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window',
    },
  });

  return result.outputFiles[0].text;


};
