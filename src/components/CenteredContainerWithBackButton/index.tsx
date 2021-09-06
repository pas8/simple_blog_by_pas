import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import styled from 'styled-components';
import { Optional } from 'utility-types';
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
const CenteredContainerWithBackButton: FC<{ divProps?: HTMLDivElement }> = ({ children, divProps }) => {
  const { back } = useRouter();
  // !!window &&   window.scrollTo(0,60 )
  return (
    <>
      <IconButton
        onClick={back}
        position={'fixed'}
        d={'M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z'}
        dimensions={{ top: 16 }}
      />
      <Wrapper>
        {
          //@ts-ignore
          <div {...divProps}> {children} </div>
        }
      </Wrapper>
    </>
  );
};

export default CenteredContainerWithBackButton;
