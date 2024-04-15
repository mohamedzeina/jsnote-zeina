import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el!);

const App = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState('');

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

    iframe.current.srcdoc = html; //To reset the iframe contents

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

    // setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              if(err instanceof Error) {
                const root = document.querySelector('#root');
                root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err.message + '</div>';
                console.log(err);
              }
              else {
                root.innerHTML = '<div style="color: red;"> Unexpected error occured </div>';
                console.log(err);
              }
              
              
            }
            
          }, false);
        </script>
      </body>
    </html>
    
  
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
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      ></iframe>
    </div>
  );
};

root.render(<App />);

/***** IFrame Sandbox *****
  1) Having sandbox prop in iframe element disables communication between parent and child 
  2) Having sandbox = 'allow-same-origin' enables communication between parent and child
  3) Having same domain, port, portocol (http vs https) enables communication between parent and child
*/

/***** srcDoc Approach with <script></script>*****
  srcDoc approach allows us to load local html which contains two script tags.
  We add the transpiled and bundled code between the script tags
  Problem #1: some packages that we import have script tags inside of them
  so the browswer automatically uses the closing script tag inside the package 
  being imported and the rest of the code inisde the imported package gets
  dumped. 
  Problem #2: if code gets very large, attribute will get very large and some
  browsers won't allow attributes of huge length 
*/

/***** Event Listener Approach *****
    Instead of having script tags, we created an event listener inside the iframe.
    We then got a reference to the iframe element and whenever a new code is
    bundled and transpiled, the parent frame posts the code as a message.
    Since we have an message event listener inside the iframe, it interecepts 
    the code that was posted by the parent. This approach elimates both of the 
    problems created by the srcDoc apporach using the script tags.
*/

/***** Eager Bundling *****
 We cannot really bundle the user's code after each character he types because that
 will take a lot of processing power. Goal is to bundle the code after the user 
 stops typing by 0.5-1s 
*/
