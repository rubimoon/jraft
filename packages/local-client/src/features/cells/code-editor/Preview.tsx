import "./Preview.css";
import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
  <html>
  <head></head>
  <body>
    <div id="root"></div>
    <script>
      const handleError =(err)=>{
        const root = document.querySelector('#root');
        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
        console.error(err);
      };

      window.addEventListener('error',(event)=>{
        event.preventDefault();
        handleError(event.error);
      });

      window.addEventListener('message', (event) => {
        try {
          eval(event.data);
        } catch (err) {
          handleError(err);
        }
      }, false);
    </script>
  </body>
</html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    //make sure every execution is independent.
    iframe.current.srcdoc = html;
    iframe.current.onload = () => {
      iframe.current.contentWindow.postMessage(code, "*");
    };
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);
  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        title="preview"
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};
export default Preview;
