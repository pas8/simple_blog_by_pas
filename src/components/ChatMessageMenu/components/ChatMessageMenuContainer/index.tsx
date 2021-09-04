import { colord } from 'colord';
import styled from 'styled-components';

export default styled.div`
  position: absolute;
  width: min-content;
  padding: 8px;
  & .searchLabelContainer {
    &:hover {
      background: ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
      cursor: pointer;
    }
    width: 93%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 6px;
  }
  border-radius: 8px;
  background: ${({ theme: { background } }) => background};
  z-index: 100000000;
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
  & > div {
    max-width: 100%;
  }
`;
