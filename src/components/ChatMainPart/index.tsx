import { FC } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { uniq, uniqBy } from 'lodash';
import ChatMessageMenu from '../ChatMessageMenu';
import { ChatMainPartPropsType } from '../../models/types';
import CenteredContainerWithBackButton from '../CenteredContainerWithBackButton';
import IconButton from '../IconButton';
import TextArea from '../CreatingPostPart/components/TextArea';
import MessageItem from '../MessageItem';
import { getUser } from '../../store/modules/App/selectors';
import Subtitle from '../Subtitle';
import dynamic from 'next/dynamic';
import UserPhoto from '../UserPhoto';
import { useRouter } from 'next/dist/client/router';
const ProfileContainer = dynamic(() => import('../ProfileContainer'), { ssr: false });

const InputContainer = styled.div`
  position: fixed;
  bottom: 0;
  float: center;
  & > div {
    width: 100%;
    position: relative;
  }
  & textarea {
    background: ${({ theme: { background } }) => background};
    width: calc(100% - 62px);
    padding: 12px 56px 12px 8px;
  }
  & svg {
    border: 0px;
  }
`;

const MessagesContainer = styled.div`
  display: flex;
  margin-top: 16px;
  margin-bottom: 10px;
  flex-direction: column;
  gap: 8px;
`;
const ContentContainer = styled.div`
  width: 100%;
  min-height: 96vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const ChatTitle = styled(Subtitle)`
  position: fixed;
  z-index: 1000;
  top: 16px;
  gap: 10px;
  align-items: center;
  display: flex;
  margin-left: 60px;
`;

const ChatMainPart: FC<ChatMainPartPropsType> = ({
  messages,
  messageValue,
  setMessageValue,
  title,
  titleURL,
  titlePhoto,
  handleAddMessage,
  children,
  ...chatMessageMenuProps
}) => {
  const user = useSelector(getUser);
  const { push } = useRouter();
  return (
    <>
      <ChatTitle>
        {titlePhoto && titleURL && <UserPhoto src={titlePhoto} onClick={() => push(titleURL)} />}

        {title}
      </ChatTitle>

      <ChatMessageMenu {...chatMessageMenuProps} />
      <CenteredContainerWithBackButton>
        <ProfileContainer>
          <ContentContainer>
            <MessagesContainer>
              {!!messages?.length &&
                uniqBy(messages, 'id')
                  .sort((a, b) => a.created - b.created)
                  ?.map(el => <MessageItem {...el} isSelfMessage={el.by === user?.id} key={el.id} />)}
            </MessagesContainer>

            <InputContainer>
              <ProfileContainer>
                <TextArea value={messageValue} onChange={({ target: { value } }) => setMessageValue(value)} />
                <IconButton
                  d={'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z'}
                  dimensions={{ bottom: 24, right: 0 }}
                  onClick={handleAddMessage}
                />
              </ProfileContainer>
            </InputContainer>
          </ContentContainer>
        </ProfileContainer>
      </CenteredContainerWithBackButton>
    </>
  );
};

export default ChatMainPart;
