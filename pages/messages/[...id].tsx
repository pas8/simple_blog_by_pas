import { colord, extend } from 'colord';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import { useRouter } from 'next/dist/client/router';
import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ChatMainPart from '../../src/components/ChatMainPart';
import { useFindUser } from '../../src/hooks/useFindUser.hook';
import { db } from '../../src/layouts/FirebaseLayout';
import { MessageType, ThemeType } from '../../src/models/types';
import { toChangeThemePropertyies } from '../../src/store/modules/App/actions';
import { getThemePropertyies, getUser } from '../../src/store/modules/App/selectors';
import mixPlugin from 'colord/plugins/mix';

const MessagesPage: FC<{ id: string }> = ({ id }) => {
  extend([mixPlugin]);
  const dispatch = useDispatch();
  const themePropertyies = useSelector(getThemePropertyies);
  const [maintheme, setMainTheme] = useState<ThemeType>(themePropertyies);
  const companion = useFindUser(id[1]);

  const user = useSelector(getUser);

  useEffect(() => {
    const primary = colord(
      colord(themePropertyies.background).isDark() &&
        colord(companion?.primaryColor || themePropertyies.primary).isDark()
        ? colord(companion?.primaryColor || themePropertyies.primary)
            .invert()
            .toHex()
        : companion?.primaryColor || themePropertyies.primary
    )
      .mix(user?.primaryColor || themePropertyies.primary)
      .toHex();
    dispatch(
      toChangeThemePropertyies({
        themePropertyies: {
          ...themePropertyies,
          primary
        }
      })
    );
    return () => {
      dispatch(toChangeThemePropertyies({ themePropertyies: maintheme }));
    };
  }, []);

  const myMessages = collection(db, `chat/${id[0]}/${id[1]}`);
  const hisMessages = collection(db, `chat/${id[1]}/${id[0]}`);

  const { push } = useRouter();
  useEffect(() => {
    if (user?.id !== id[0]) push('/');
  }, [id[0]]);
  const [messages, setMessages] = useState<MessageType[]>([]);

  onSnapshot(myMessages, {
    next: snap =>
      snap
        .docChanges()
        .forEach(({ doc }) =>
          setMessages(state =>
            state.some(el => el.id === doc.id)
              ? state
              : ([...state, { id: doc.id, ...doc.data(), by: id[0] }] as MessageType[])
          )
        )
  });
  onSnapshot(hisMessages, {
    next: snap =>
      snap
        .docChanges()
        .forEach(({ doc }) =>
          setMessages(state =>
            state.some(el => el.id === doc.id)
              ? state
              : ([...state, { id: doc.id, ...doc.data(), by: id[1] }] as MessageType[])
          )
        )
  });

  const [messageValue, setMessageValue] = useState('');
  const handleAddMessage = async () => {
    await addDoc(myMessages, {
      created: Date.now(),
      value: messageValue,
      by: user?.id,
      isEdited: false
    });
    setMessageValue('');
  };

  const handleUpdateMessage = async (docId: string, value: string) => {
    const currentDoc = doc(myMessages, docId);

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
    const currentDoc = doc(messages.find(({ id }) => id === docId)?.by === id[0] ? myMessages : hisMessages, docId);
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

  if (user?.id !== id[0]) return <></>;
  return (
    <>
      <ChatMainPart
        messages={messages}
        titleURL={`/profile/${id[1]}`}
        isPrivateMode
        titlePhoto={companion?.photoURL}
        title={companion?.displayName}
        handleAddMessage={handleAddMessage}
        handleDeleteMessage={handleDeleteMessage}
        handleUpdateMessage={handleUpdateMessage}
        messageValue={messageValue}
        setMessageValue={setMessageValue}
      />
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const { id } = context.query;

  return {
    props: { id }
  };
};

export default MessagesPage;
