import styled from 'styled-components';

export default styled.div`
  gap: 8px;

  margin-bottom: ${({ isCommentsExists = true }: any) => (isCommentsExists ? '8px' : '0px')};
  display: flex;
`;
