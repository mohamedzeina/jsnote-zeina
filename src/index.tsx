import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el!);

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
    console.log(ref.current);
  };

  useEffect(() => {
    startService();
  }, []); //Second argument ([]) just states that this function will be called only once when the page renders

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)], //Plugins are ran from left to right
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    setCode(result.outputFiles[0].text);
  };

  const html = `
  <script> 
    ${code} 
  </script>
  `;

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      <iframe sandbox="allow-scripts" srcDoc={html}></iframe>
    </div>
  );
};

root.render(<App />);

/***** IFrame Sandbox *****
  1) Having sandbox prop in iframe element disables communication between parent and child 
  2) Having sandbox = 'allow-same-origin' enables communication between parent and child
  3) Having same domain, port, portocol (http vs https) enables communication between parent and child
*/
