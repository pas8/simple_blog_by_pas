import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
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
import dynamic from 'next/dynamic';
import ChatMessageMenu from '../../src/components/ChatMessageMenu';
import { toast } from 'react-toastify';
import { uniq, uniqBy } from 'lodash';
import TextArea from '../../src/components/CreatingPostPart/components/TextArea';

const InputContainer = styled.div`
  position: relative;

  & textarea {
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
            state.some(el => el.id === doc.id) ? state : ([...state, { id: doc.id, ...doc.data() }] as MessageType[])
          )
        )
  });

  const [messageValue, setMessageValue] = useState('');
  const handleAddMessage = async () => {
    await addDoc(messageCollection, {
      created: Date.now(),
      value: messageValue,
      by: user?.id,
      isEdited: false
    });
    setMessageValue('');
  };

  const handleUpdateMessage = async (docId: string, value: string) => {
    const currentDoc = doc(messageCollection, docId);

    try {
      await updateDoc(currentDoc, { value, isEdited: true });
      setMessages(state => [
        ...state.filter(({ id }) => id !== docId),
        { ...state.find(({ id }) => id !== docId), isEdited: true, value } as MessageType
      ]);
    } catch (error) {
      console.log(error);
      toast('Something went wrong, try again ', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    }
  };

  const handleDeleteMessage = async (docId: string) => {
    const currentDoc = doc(messageCollection, docId);
    try {
      await deleteDoc(currentDoc);
      setMessages(state => [...state.filter(({ id }) => id !== docId)]);
    } catch (error) {
      console.log(error);
      toast('Something went wrong, try again ', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    }
  };
  return (
    <>
      <ChatMessageMenu handleDeleteMessage={handleDeleteMessage} handleUpdateMessage={handleUpdateMessage} />
      <CenteredContainerWithBackButton>
        <div style={{  marginLeft:'-42px'}}>
        <MessagesContainer>
          {!!messages?.length &&
            uniqBy(messages, 'id')
              .sort((a, b) => a.created - b.created)
              ?.map(el => <MessageItem {...el} isSelfMessage={el.by === user?.id} key={el.id} />)}
        </MessagesContainer>
        <InputContainer>
          <TextArea value={messageValue} onChange={({ target: { value } }) => setMessageValue(value)} />
          <IconButton
            d={'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z'}
            dimensions={{ bottom: 18, right: -48 }}
            onClick={handleAddMessage}
          />
        </InputContainer>
        </div>
      </CenteredContainerWithBackButton>
    </>
  );
};

export default Chat;
