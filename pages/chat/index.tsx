import { collection, query, where, orderBy, getDocs, limit, addDoc, onSnapshot } from 'firebase/firestore';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import { db } from '../../src/layouts/FirebaseLayout';
import { useCollectionData, useCollection } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';
import TitleInput from '../../src/components/CreatingPostPart/components/TitleInput';
import IconButton from '../../src/components/IconButton';
import { useSelector } from 'react-redux';
import { getUser } from '../../src/store/modules/App/selectors';
import Text from '../../src/components/Text';
import styled from 'styled-components';
import { MessageType } from '../../src/models/types';
import MessageItem from '../../src/components/MessageItem';
import ChatMessageMenu from '../../src/components/ChatMessageMenu';
const InputContainer = styled.div`
  position: relative;

  & input {
    padding-right: 56px;
  }
  & svg {
    border: 0px;
  }
`;

const MessagesContainer = styled.div`
  display: flex;
  width: calc(100% + 42px);
  margin-bottom: 10px;
  flex-direction: column;
  gap: 8px;
`;

const Chat = () => {
  const user = useSelector(getUser);
  const messageCollection = collection(db, 'messages');

  const [messages, setMessages] = useState<MessageType[]>([]);

  onSnapshot(messageCollection, {
    next: snap =>
      snap
        .docChanges()
        .forEach(({ doc }) =>
          setMessages(state =>
            state.some(el => el.id === doc.id) ? state : ([...state, { id: doc.id, ...doc.data() }] as MessageType)
          )
        )
  });
  // const q = query(messageCollection, orderBy('createdAt'), limit(25));
  const querySnapshot = getDocs(messageCollection);
  // querySnapshot.then(r => r.forEach(doc => h.push(doc.data())));
  // console.log(h);

  // console.log(messages);

  const [messageValue, setMessageValue] = useState('');
  const handleAddMessage = async () => {
    await addDoc(messageCollection, {
      created: Date.now(),
      value: messageValue,
      by: user?.id
    });
    setMessageValue('');
  };
  return (
    <>
      <ChatMessageMenu />
      <CenteredContainerWithBackButton>
        <MessagesContainer>
          {!!messages?.length && messages?.map(el => <MessageItem {...el} isSelfMessage={el.by === user?.id} />)}
        </MessagesContainer>
        <InputContainer>
          <TitleInput value={messageValue} onChange={({ target: { value } }) => setMessageValue(value)} />
          <IconButton
            d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
            dimensions={{ top: 0, bottom: 0, right: -42 }}
            onClick={handleAddMessage}
          />
        </InputContainer>
      </CenteredContainerWithBackButton>
    </>
  );
};

export default Chat;
