import { collection, query, limit, getDocs, getDoc, doc, orderBy } from 'firebase/firestore';
import { FC } from 'react';
import styled from 'styled-components';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import ChatsPreviewItemContainer from '../../src/components/ChatsPreviewItem/components/ChatsPreviewItemContainer';
import FlexContainerWithBorder from '../../src/components/FlexContainerWithBorder';
import SeachingUserItem from '../../src/components/SeachingUserItem';
import Title from '../../src/components/Title';
import { db } from '../../src/layouts/FirebaseLayout';
import { ProfileType } from '../../src/models/types';

const UsersContainer = styled(FlexContainerWithBorder)`
  flex-direction: column;
`;

const Users: FC<{ top8Users: ProfileType[] }> = ({ top8Users }) => {
  console.log(top8Users)
  return (
    <CenteredContainerWithBackButton>
      <Title>Top 8 users</Title>
      <UsersContainer>
        {top8Users.map(props => {
          return <SeachingUserItem {...props} key={props.id} />;
        })}
      </UsersContainer>
    </CenteredContainerWithBackButton>
  );
};

export default Users;

export const getServerSideProps = async () => {
  const top8Users: ProfileType[] = [];
  const q = query(collection(db, 'users'), orderBy('crownsLength','desc'), limit(8));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async doc => {
    top8Users.push({ ...doc.data(), id: doc.id } as ProfileType);
  });
  return {
    props: {
      top8Users
    }
  };
};
