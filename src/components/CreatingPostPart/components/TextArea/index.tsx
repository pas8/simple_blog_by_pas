import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import { colord } from 'colord';

export default styled(TextareaAutosize)`
margin-bottom: 16px;
width: calc(100% - 0.96em);
resize: none;
outline: none;
font-size: 1.42em;
overflow: hidden;
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
