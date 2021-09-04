import styled from 'styled-components';
import { colord } from 'colord';

export default  styled.div`
color: ${({ theme: { text } }) => text};
display: flex;
padding: 6px;
& svg {
  margin-right: 6px;
  width: 24px;
}
&:hover {
  background: ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
  cursor: pointer;
}
border-bottom: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
`;