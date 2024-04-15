import { useRef, useEffect } from 'react';

interface PreviewProps {
  code: string;
}

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

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html; // reset the iframe contents
    iframe.current.contentWindow.postMessage(code, '*');
  }, [code]); // anytime we get new code, reset the iframe contents

  return (
    <iframe
      style={{ backgroundColor: 'white' }}
      title="preview"
      ref={iframe}
      sandbox="allow-scripts"
      srcDoc={html}
    />
  );
};

export default Preview;
