import { colord } from 'colord';
import styled from 'styled-components';

export default styled.div`
  opacity: ${({
    //@ts-ignore
    isHaveAccess =true
  }) => (isHaveAccess ? 1 : 0.42)};
  border-bottom: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
  display: flex;
  align-items: center;
  & .imgPlaceholder {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
  }
  padding: 8px;
  & img {
    border: 1px solid transparent;
    margin-right: 8px;
    border-radius: 50%;
  }
  & h6 {
    word-break: break-word;
  }
  &:hover {
    cursor: pointer;
    & img {
      border-color: ${({ theme: { background } }) => background};
    }
    & h6 {
      color: ${({ theme: { background } }) => background};
    }
    background: ${({ color }) => color};
  }
`;
