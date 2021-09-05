import { colord } from 'colord';
import styled from 'styled-components';

export default styled.div`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
`;
