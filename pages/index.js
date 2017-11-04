import Editor from '../components/Editor';

export default () =>
  <div id='app'>
    <Editor/>
    <style jsx global>{`
      html, body {
        font: 16px/1.5 system-ui;
        letter-spacing: -.03em;
      }
    `}</style>
  </div>;
