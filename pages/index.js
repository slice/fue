import Editor from '../components/Editor';
import styled from 'styled-components';

const App = styled.div`
  font: 16px/1.5 system-ui;
  letter-spacing: -0.03em;
`;

export default () => (
  <App>
    <Editor />
  </App>
);
