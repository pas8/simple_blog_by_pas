import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FC, useState } from 'react';
import styled from 'styled-components';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import KickedUserItem from '../../src/components/KickedUserItem';
import Title from '../../src/components/Title';
import { db } from '../../src/layouts/FirebaseLayout';
import { KickedUserType } from '../../src/models/types';
import { colord } from 'colord';
import Dialog from '../../src/components/Dialog';
import { useFindUser } from '../../src/hooks/useFindUser.hook';
import Button from '../../src/components/Button';
import CloseButton from '../../src/components/CloseButton';
import Subtitle from '../../src/components/Subtitle';
import SearchLabel from '../../src/components/CreatingPostPart/components/SearchLabel';
import FlexContainerWithBorder from '../../src/components/FlexContainerWithBorder';
import { useFindRankD } from '../../src/hooks/useFindRankD.hook';
import { capitalize } from 'lodash';
import KickedUserDetailsContent from '../../src/components/KickedUserDetailsContent';
import { useRouter } from 'next/dist/client/router';
import { useSelector } from 'react-redux';
import { getUser } from '../../src/store/modules/App/selectors';

const KickedUsersContainer = styled(FlexContainerWithBorder)`
  flex-direction: column;
`;

const KickedPage: FC<{ kickedUsersArr: KickedUserType[] }> = ({ kickedUsersArr }) => {
  const [dialogProps, setDialogProps] = useState<KickedUserType>({} as KickedUserType);

  const user = useSelector(getUser);
  const kickedUser = useFindUser(dialogProps?.id || '');
  const { push } = useRouter();
  return (
    <>
      <Dialog
        title={''}
        isOpen={!!Object.values(dialogProps).length}
        contentChildren={<KickedUserDetailsContent {...dialogProps} rank={kickedUser?.rank as any} />}
        utilsChildren={
          <>
            <CloseButton onClick={() => setDialogProps({} as KickedUserType)} />
            <Button onClick={() => push(`/profile/${dialogProps.id}`)}>To user profile </Button>
          </>
        }
      />

      <CenteredContainerWithBackButton>
        <Title>Kicked users</Title>
        <KickedUsersContainer>
          {kickedUsersArr.map(props => {
            const handleOpenDetailsDialog = () => {
              setDialogProps(props);
            };
            return (
              <KickedUserItem
                {...props}
                key={props.id}
                handleOpenDetailsDialog={handleOpenDetailsDialog}
                userRank={user?.rank!}
              />
            );
          })}
        </KickedUsersContainer>
      </CenteredContainerWithBackButton>
    </>
  );
};

export default KickedPage;

export const getServerSideProps = async () => {
  let kickedUsersArr: KickedUserType[] = [];
  const kickedUsersRef = collection(db, 'kicked');
  const kickedUsersSnap = await getDocs(kickedUsersRef);

  kickedUsersSnap.forEach(async doc => {
    kickedUsersArr.push({ ...doc.data(), id: doc.id } as KickedUserType);
  });

  return {
    props: { kickedUsersArr }
  };
};
