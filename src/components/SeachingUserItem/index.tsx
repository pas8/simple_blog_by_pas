import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { FC } from 'react';
import styled from 'styled-components';
import { useFindRankD } from '../../hooks/useFindRankD.hook';
import { useValidateColor } from '../../hooks/useValidateColor.hook';
import { useValidateNumber } from '../../hooks/useValidateNumber.hook';
import { ProfileType } from '../../models/types';
import ChatsPreviewItemContainer from '../ChatsPreviewItem/components/ChatsPreviewItemContainer';
import CrownPreviewContainer from '../CrownPreviewContainer';
import Subtitle from '../Subtitle';
const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  position: relative;
`;

const CrownContainer = styled.div`
  border-radius: 50%;
  margin-left:16px;
  width: 2.8rem;
  white-space: nowrap;
  & svg {
    margin-left: -2px;
  }
  height: 2.8rem;
  display: grid;
  place-items: center;
  border: 1px solid;
  & > div {
    display: flex;
  }
`;

const Container = styled(ChatsPreviewItemContainer)`
& a {
position:absolute;
inset:0

}
&:hover {
  color: ${({ theme: { background } }) => background};
& h6 {

  text-decoration:underline;

}
`;

const SeachingUserItem: FC<ProfileType> = ({ id, rank, displayName, primaryColor, photoURL, crowns }) => {
  const color = useValidateColor(primaryColor || '');
  const d = useFindRankD(rank);

  return (
    <Container color={color}>
      <ContentContainer>
        <Subtitle>
          {<img src={photoURL} width={48} height={48} />}

          <svg viewBox={'0 0 24 24'} width={42} height={42}>
            <path d={d} fill={'currentcolor'} />
          </svg>
          {displayName || 'Loading'}
        </Subtitle>

        <CrownContainer className={'crownContainer'}>
          <div>
            {useValidateNumber(crowns.length)}

            <svg viewBox="0 0 24 24" width={22} height={22}>
              <path
                fill={'currentColor'}
                d={
                  'M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z'
                }
              />
            </svg>
          </div>
        </CrownContainer>
      </ContentContainer>
      <Link href={`/profile/${id}`}> </Link>
    </Container>
  );
};

export default SeachingUserItem;
