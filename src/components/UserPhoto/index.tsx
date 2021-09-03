import styled from 'styled-components';

export default styled.img`
  width: 2.8rem;
  border-radius: 50%;
  height: 2.8rem;
  border: 1px solid ${({ theme: { text } }) => text};
  &:hover {
    cursor: pointer;
    border-color: ${({ theme: { primary } }) => primary};
  }
`;
