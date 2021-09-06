import { collection, query, getDocs, where } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { FC } from 'react';
import styled from 'styled-components';
import CenteredContainerWithBackButton from '../../../src/components/CenteredContainerWithBackButton';
import FlexContainerWithBorder from '../../../src/components/FlexContainerWithBorder';
import SeachingUserItem from '../../../src/components/SeachingUserItem';
import Title from '../../../src/components/Title';
import { useUnLoginedUserDefender } from '../../../src/hooks/useUnLoginedUserDefender.hook';
import { db } from '../../../src/layouts/FirebaseLayout';
import { ProfileType } from '../../../src/models/types';

const UsersContainer = styled(FlexContainerWithBorder)`
  flex-direction: column;
  width: 100%;
`;

const Fired: FC<{ users: ProfileType[]; id: string }> = ({ users, id }) => {
  const [condition, placeholder] = useUnLoginedUserDefender(id);
  if (condition) return placeholder;

  return (
    <CenteredContainerWithBackButton>
      <Title>Fired users</Title>

      <UsersContainer>
        {users.map(props => {
          return <SeachingUserItem {...props} key={props.id} isCrownWasGiven />;
        })}
      </UsersContainer>
    </CenteredContainerWithBackButton>
  );
};

export default Fired;

export const getServerSideProps: GetServerSideProps = async ({ query: { id } }) => {
  const users: ProfileType[] = [];
  const q = query(collection(db, 'users'), where('crowns', 'array-contains-any', [id]));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async doc => {
    users.push({ ...doc.data(), id: doc.id } as ProfileType);
  });
  return {
    props: {
      users: users.sort((a, b) => b.crowns.length - a.crowns.length),
      id
    }
  };
};
