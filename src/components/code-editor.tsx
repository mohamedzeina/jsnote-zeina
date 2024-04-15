import MonacoEditor from '@monaco-editor/react';

const codeEditor = () => {
  return (
    <MonacoEditor
      theme="dark"
      language="javascript"
      height="500px"
      options={{
        wordWrap: 'on',
      }}
    />
  );
};

export default codeEditor;
