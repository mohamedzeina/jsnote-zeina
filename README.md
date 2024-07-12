## Description
JSNote-Zeina is a React and TypeScript application designed as an interactive coding environment. It enables users to write JavaScript, see it executed in real-time, and create comprehensive documentation using Markdown.

Key features include:

* Code Cells: Create and edit JavaScript code using the Monaco Editor.
* Code Formatting: Automatically format code using Prettier.
* Execution and Preview: Execute code and preview the results instantly.
* Text Cells: Write documentation for code cells using a Markdown Editor.
* Cell Management: Delete or reorder cells via an action bar.
* Cumulative Code Execution: Reference variables across different code cells.
* Display Functionality: Use the built-in `show` function to display React components, strings, numbers, and more.
* Persistent Changes: Save all changes to the file opened with Jbook. For example, running `npx jsnote-zeina serve test.js` saves all text and code to `test.js`.

## Tools & Mechanisms
* Code Transpiling and Bundling: Handled in-browser using ESBuild.
* Dynamic Package Importing: Fetch NPM packages via the Unpkg API.
* Caching: Improve performance with request caching for NPM packages.
* Safe Code Execution: Execute untrusted code safely within a sandboxed iframe.
* Editors: Utilize Monaco Editor for code and uiw/react-md-editor for Markdown.
* Code Highlighting: Implemented using monaco-jsx-highlighter and jscodeshift.
* Cell Resizing: Enabled with React Resizable.
* State Management: Used Redux for storing and manipulating cells and bundles, with Immer simplifying state updates within reducers.
* Package-Based Development: Managed using Lerna.
Command Line Interface: Implemented with Commander.
Local Server: Created using Express for the local API.
  

## How To Run Locally
Running the application on port 4005 (default) and notebook.js file (default)
```
npx jsnote-zeina serve
```
Running the application on a custom port (5000) and notebook.js file (default)
```
npx jsnote-zeina serve -p 5000
```
or
```
npx jsnote-zeina serve -port=5000
```
Running the application on port 4005 (default) and a custom file (test.js)
```
npx jsnote-zeina serve test.js
```


