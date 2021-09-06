import { collection, query, limit, getDocs, getDoc, doc, orderBy } from 'firebase/firestore';
import { ChangeEventHandler, FC, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import ChatsPreviewItemContainer from '../../src/components/ChatsPreviewItem/components/ChatsPreviewItemContainer';
import FlexContainerWithBorder from '../../src/components/FlexContainerWithBorder';
import Input from '../../src/components/Input';
import SeachingUserItem from '../../src/components/SeachingUserItem';
import Subtitle from '../../src/components/Subtitle';
import Title from '../../src/components/Title';
import { useSearchUsers } from '../../src/hooks/useSearchUsers.hook';
import { db } from '../../src/layouts/FirebaseLayout';
import { ProfileType } from '../../src/models/types';
import { getUser } from '../../src/store/modules/App/selectors';

const UsersContainer = styled(FlexContainerWithBorder)`
  flex-direction: column;
  width: 100%;
`;

const To8UsersSubtitle = styled(Subtitle)`
  padding: 10px;
`;
const SearchInput = styled(Input)`
  width: calc(100% - 20px);
`;

const Users: FC<{ top8Users: ProfileType[] }> = ({ top8Users }) => {
  const [queryUsers, setQueryUsers] = useState<ProfileType[]>([] as ProfileType[]);
  const [searchValue, setSearchValue] = useState('');
  const onChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    useSearchUsers(value, setSearchValue, setQueryUsers);
  };

  const user = useSelector(getUser);

  return (
    <CenteredContainerWithBackButton>
      <Title>Search Users</Title>
      <SearchInput value={searchValue} onChange={onChange} placeholder={'*start search with @ or $'} />

      <UsersContainer>
        {searchValue.length < 2 && <To8UsersSubtitle>Top 8 users:</To8UsersSubtitle>}

        {(searchValue.length < 2 ? top8Users : queryUsers).map(props => {
          return <SeachingUserItem {...props} key={props.id} isCrownWasGiven={props.crowns.includes(user?.id!)} />;
        })}
      </UsersContainer>
    </CenteredContainerWithBackButton>
  );
};

export default Users;

export const getServerSideProps = async () => {
  const top8Users: ProfileType[] = [];
  const q = query(collection(db, 'users'), orderBy('crownsLength', 'desc'), limit(8));

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
