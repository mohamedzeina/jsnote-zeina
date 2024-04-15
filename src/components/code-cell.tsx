import { useState } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler';
import Resizable from './resizable';
import { ResizableBox } from 'react-resizable';

const CodeCell = () => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  return (
    <Resizable direction="vertical">
      <div>
        <CodeEditor initalValue="hi" onChange={(value) => setInput(value)} />
        <div>
          <button onClick={onClick}>Submit</button>
        </div>
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
