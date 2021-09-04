import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import src from './../../public/Screenshot from 2021-09-04 17-55-49.png';
import styled from 'styled-components';
const ProfileContainer = dynamic(() => import('../../src/components/ProfileContainer'), { ssr: false });
const Container = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  & > div {
    transform: scale(1.16);
  }
  & img {
    border-radius: 8px;
  }
`;
const Dbsynm = () => {
  return (
    <CenteredContainerWithBackButton>
      <ProfileContainer>
        <Container>
          <Image src={src} />
        </Container>
      </ProfileContainer>{' '}
    </CenteredContainerWithBackButton>
  );
};

export default Dbsynm;
