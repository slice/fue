import styled from 'styled-components';

export const Button = styled.button.attrs({
  type: 'button'
})`
  background: #fff;
  border: solid 1px #ddd;
  border-radius: 0.15rem;
  cursor: pointer;
  ${props =>
    props.jumbo &&
    `
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
  `};
`;
