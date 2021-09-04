import { colord } from 'colord';
import styled from 'styled-components';

export default styled.div`
margin-top: 8px;
border-radius: 8px;
border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
overflow: hidden;
`;
