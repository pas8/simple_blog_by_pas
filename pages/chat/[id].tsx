import { getDocs, collectionGroup } from 'firebase/firestore';
import { db } from '../../src/layouts/FirebaseLayout';
import { FC } from 'react';
import { RankVariants } from '../../src/models/types';
import { toast } from 'react-toastify';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import { useRouter } from 'next/dist/client/router';
import { uniq } from 'lodash';
import Title from '../../src/components/Title';
import ChatsPreviewIem from '../../src/components/ChatsPreviewItem';
import Subtitle from '../../src/components/Subtitle';
import ChatsPreviewItemContainer from '../../src/components/ChatsPreviewItem/components/ChatsPreviewItemContainer';
import { useUnLoginedUserDefender } from '../../src/hooks/useUnLoginedUserDefender.hook';
import FlexContainerWithBorder from '../../src/components/FlexContainerWithBorder';
import styled from 'styled-components';

const ChatContainer = styled(FlexContainerWithBorder)`
  flex-direction: column;
`;

const Chat: FC<{ id: string; uniqUsers: string[] }> = ({ id, uniqUsers }) => {
  const [condition, placeholder, user] = useUnLoginedUserDefender(id);
  if (condition) return placeholder;
  const { push } = useRouter();
  const isHaveAccess = user.rank !== RankVariants.HASTATI;

  return (
    <>
      <CenteredContainerWithBackButton>
        <Title>All chats</Title>
        <ChatContainer>
          {
            <ChatsPreviewItemContainer
              color={user?.primaryColor}
              onClick={() =>
                isHaveAccess
                  ? push('/chat/group')
                  : toast(
                      'Your rank is so small to have access to group chat, you can raise your rank by creting posts for blog  ',
                      {
                        type: 'info',
                        theme: 'colored',
                        position: 'bottom-right'
                      }
                    )
              }
              //@ts-ignore
              isHaveAccess={isHaveAccess}
            >
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
        </ChatContainer>
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

  return {
    props: { uniqUsers, id }
  };
};

export default Chat;
