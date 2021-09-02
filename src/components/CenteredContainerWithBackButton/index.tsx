import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import styled from 'styled-components';
import Container from '../Container';
import IconButton from '../IconButton';

const Wrapper = styled(Container)`
  display: grid;
  place-items: center;
  & > div {
    padding: 4rem 0;
  }
  position: relative;
`;
const CenteredContainerWithBackButton: FC = ({ children }) => {
  const { back } = useRouter();

  return (
    <Wrapper>
      <IconButton
        onClick={back}
        d={'M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z'}
        dimensions={{ top: 16, left: 0 }}
      />
      <div> {children} </div>
    </Wrapper>
  );
};

export default CenteredContainerWithBackButton;