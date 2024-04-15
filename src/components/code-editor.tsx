import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';

interface codeEditorProps {
  initalValue: string;
  onChange(value: string): void;
}

const codeEditor: React.FC<codeEditorProps> = ({ onChange, initalValue }) => {
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
  };

  return (
    <MonacoEditor
      editorDidMount={onEditorDidMount}
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
