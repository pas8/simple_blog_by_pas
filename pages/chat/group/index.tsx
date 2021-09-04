import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../src/layouts/FirebaseLayout';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from '../../../src/store/modules/App/selectors';
import { MessageType } from '../../../src/models/types';
import { toast } from 'react-toastify';
import ChatMainPart from '../../../src/components/ChatMainPart';

const GroupChat = () => {
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
      <ChatMainPart
        title={'Group chat'}
        messages={messages}
        titleURL={'/dbsynm'}
        isPrivateMode
        titlePhoto={
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP8AAACqCAMAAABVlWm8AAAABlBMVEUAV7f/1wDfELsCAAAAhElEQVR4nO3PMQEAAAjAIO1f2hRegwbMAAAAAAAAAAAAAAAAAAAAAAAAAAAAPNk2/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv+2A+BhVKwOtdkDAAAAAElFTkSuQmCC'
        }
        handleAddMessage={handleAddMessage}
        handleDeleteMessage={handleDeleteMessage}
        handleUpdateMessage={handleUpdateMessage}
        messageValue={messageValue}
        setMessageValue={setMessageValue}
      />
    </>
  );
};

export default GroupChat;
