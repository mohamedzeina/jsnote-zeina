import 'bulmaswatch/superhero/bulmaswatch.min.css';

import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import CodeEditor from './components/code-editor';
import Preview from './components/preview';
import bundle from './bundler';

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el!);

const App = () => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  return (
    <div>
      <CodeEditor initalValue="hi" onChange={(value) => setInput(value)} />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
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
