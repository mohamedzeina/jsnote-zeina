## Description
Jbook is an application made with React and Typescript. It is a code editing application used for testing and showcasing user-created HTML, CSS and JavaScript code snippets like CodePen and CodeSandBox. 

The application allows the user to:
1) Create Code Cells and Write HTML, CSS and JavaScript Code Inside a Monaco Editor
2) Format the Written Code Using Prettier
3) Execute and Preview the Result of the Written Code
4) Create Text Cells and Write Narrative Text Inside Using a Markdown Editor
5) Delete and Change the Order of the Cells Using an Action Bar

## Tools & Mechanisms
* In-Browser Code transpiling and bundling is done using ESBuild   
* NPM packages to be imported by the user are dynamically fetched using the Unpkg API  
* Caching is implemented for the requests used to fetch NPM packages to improve the performance  
* Safe handling untrusted code execution is achieved by using a sandboxed IFrame  
* Monaco editor is used as the code editor and Prettier is used as the code formatter  
* Code highlighting is done using monaco-jsx-highlighter and jscodeshift
* Resizing of the cells is done using React Resizable
* The uiw/react-md-editor is used as the markdown editor
* Storage and manipulation of cell data is done using Redux 
* State updates inside the redux reducer is simplified using Immer

## How To Run Locally
First, clone the repo to your local machine:
```

```
Then, open up a terminal in the project's directory and install next by running the following command:
```

```
Then, open a terminal in the local repo and run the development server:

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

