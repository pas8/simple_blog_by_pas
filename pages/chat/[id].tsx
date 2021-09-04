import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  collectionGroup,
  getDoc
} from 'firebase/firestore';
import { db } from '../../src/layouts/FirebaseLayout';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from '../../src/store/modules/App/selectors';
import { MessageType } from '../../src/models/types';
import { toast } from 'react-toastify';
import ChatMainPart from '../../src/components/ChatMainPart';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import { useRouter } from 'next/dist/client/router';
import { listAll } from 'firebase/storage';
import { map, uniq } from 'lodash';
import Title from '../../src/components/Title';
import styled from 'styled-components';
import { colord } from 'colord';
import ChatsPreviewIem from '../../src/components/ChatsPreviewItem';
import Subtitle from '../../src/components/Subtitle';
import ChatsPreviewItemContainer from '../../src/components/ChatsPreviewItem/components/ChatsPreviewItemContainer';

const ChatsContainer = styled.div`
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
  border-radius: 8px;
  overflow: hidden;
`;

const Chat: FC<{ id: string; uniqUsers: string[] }> = ({ id, uniqUsers }) => {
  const user = useSelector(getUser);
  const { push } = useRouter();
  useEffect(() => {
    if (user?.id !== id) push('/');
  }, [id]);
  if (user?.id !== id) return <></>;

  return (
    <>
      <CenteredContainerWithBackButton>
        <Title>All chats</Title>
        <ChatsContainer>
          {
            //@ts-ignore
            <ChatsPreviewItemContainer color={user?.primaryColor} onClick={() => push('/chat/group')}>
              <img
                src={
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP8AAACqCAMAAABVlWm8AAAABlBMVEUAV7f/1wDfELsCAAAAhElEQVR4nO3PMQEAAAjAIO1f2hRegwbMAAAAAAAAAAAAAAAAAAAAAAAAAAAAPNk2/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv+2A+BhVKwOtdkDAAAAAElFTkSuQmCC'
                }
                width={48}
                height={48}
              />
              <Subtitle> {'Group chat'}</Subtitle>
            </ChatsPreviewItemContainer>
          }
          {uniqUsers.map(id => (
            <ChatsPreviewIem id={id} key={id} />
          ))}
        </ChatsContainer>
      </CenteredContainerWithBackButton>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const { id } = context.query;

  const group = collectionGroup(db, id);
  const docSnap = await getDocs(group);
  const users: string[] = [];

  docSnap.forEach(async doc => {
    users.push(doc?.ref?.parent?.parent?.id || '');
  });
  const uniqUsers = uniq(users);

  // const userChats = map(uniqUsers, async id => {
  //   const userDoc = doc(db, 'users', id);
  //   const userSnap = await getDoc(userDoc);
  //   return { id: userSnap.id };
  // });
  return {
    props: { uniqUsers, id }
  };
};

export default Chat;
