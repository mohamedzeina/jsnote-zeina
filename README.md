## Description
JSNote-Zeina is an application made with React and Typescript. It is an interactive coding environment. You can write Javascript, see it executed, and write coprehensive documentation using markdown.

The application allows the user to:
1) Create code cells and JavaScript code using a Monaco Editor
2) Format the written code using Prettier
3) Execute and preview the result of the written code
4) Create text cells and write documentation of the code cells using a Markdown Editor
5) Delete and change the order of the Cells using an action bar
6) Cumulative code execution is allowed. If a user defines a variable in cell #1, they can refer to it in any following code cell\
7) Show any React component, string, number, or anything else by calling the built in `show `function
8) All changes get saved to the file the user opened Jbook with. If  a user ran `npx jsnote-zeina serve test.js` , all of the text and code will be saved to the `test.js` file

## Tools & Mechanisms
* In-Browser Code transpiling and bundling is done using ESBuild   
* NPM packages to be imported by the user are dynamically fetched using the Unpkg API  
* Caching is implemented for the requests used to fetch NPM packages to improve the performance  
* Safe handling untrusted code execution is achieved by using a sandboxed IFrame  
* Monaco editor is used as the code editor and Prettier is used as the code formatter  
* Code highlighting is done using monaco-jsx-highlighter and jscodeshift
* Resizing of the cells is done using React Resizable
* The uiw/react-md-editor is used as the markdown editor
* Storage and manipulation of cells and bundles is done using Redux 
* State updates inside the redux reducers are simplified using Immer
* Package based development is achieved using Lerna
* CLI is implemented using Commander
* Local-API utilized Express for creating the server
  

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


