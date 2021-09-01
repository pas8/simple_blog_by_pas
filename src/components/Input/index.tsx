import { colord } from 'colord';
import styled from 'styled-components';

export default styled.input`
  margin-bottom: 16px;
  outline: none;
  font-size: 1.42em;
  padding: 0.4em 0.4em;
  color: ${({ theme: { text } }) => text};
  background: transparent;
  border:1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()}};
  caret-color: ${({ theme: { primary } }) => primary};
  border-radius: 8px;
  &:hover{
    border-color: ${({ theme: { text } }) => text};
  }
  &:focus {
    border-color: ${({ theme: { primary } }) => primary};
  }
`;
