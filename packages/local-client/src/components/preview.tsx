import './preview.css';
import { useRef, useEffect } from 'react';

interface PreviewProps {
  code: string;
  bundlingError: string;
}

const html = `
    <html>
      <head>
        <style>html { background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
        const handleError = (err) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err.message + '</div>';
          console.log(err);
        };
        
        window.addEventListener('error', (event) => {
          event.preventDefault();
          handleError(event.error);
        });

        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (err) {
            if(err instanceof Error) {
              handleError(err);
            }
            else {
              throw err;
              }
            } 
          }, false);
        </script>
      </body>
    </html>
    
  `;

const Preview: React.FC<PreviewProps> = ({ code, bundlingError }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html; // reset the iframe contents
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*'); // post message was too fast so code execution was not being displayed
    }, 50);
  }, [code]); // anytime we get new code, reset the iframe contents

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {bundlingError && <div className="preview-error">{bundlingError} </div>}
    </div>
  );
};

export default Preview;
