import MonacoEditor from '@monaco-editor/react';

interface codeEditorProps {
  initalValue: string;
}

const codeEditor: React.FC<codeEditorProps> = ({ initalValue }) => {
  return (
    <MonacoEditor
      value={initalValue} // Initial value of the editor
      theme="dark"
      language="javascript"
      height="500px"
      options={{
        wordWrap: 'on',
        minimap: { enabled: false },
        showUnused: false, // Do not fade out import statements that are not used straight away
        folding: false,
        lineNumbersMinChars: 3,
        fontSize: 16,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};

export default codeEditor;
