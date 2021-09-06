import styled from 'styled-components';

export default styled.div`
  border-radius: 8px;
  padding:0px 0px 0px 4px;
  background: ${({ theme: { background } }) => background};
  color: ${({
    theme: { text, primary },
    //@ts-ignore
    isCrownWasGiven
  }) => (isCrownWasGiven ? primary : text)};
  font-size: 1rem;
  border: 1px solid;
  &:hover {
    border-color: ${({
      theme: { text, primary },
      //@ts-ignore
      isCrownWasGiven
    }) => (isCrownWasGiven ? primary : text)};
    color: ${({ theme: { background } }) => background};
    background: ${({
      theme: { text, primary },
      //@ts-ignore
      isCrownWasGiven
    }) => (isCrownWasGiven ? primary : text)};
    cursor: pointer;
  }
  display: flex;
  top: -4px;
  right: -8px;
  position: absolute;
  align-items: center;
`;
