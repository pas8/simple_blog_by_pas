import { colord } from 'colord';
import { doc, getDoc } from 'firebase/firestore';
import { FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { db } from '../../layouts/FirebaseLayout';
import { MessageType, ProfileType } from '../../models/types';
import { toChangeMessageMenuProperties } from '../../store/modules/App/actions';
import Text from '../Text';

const MessageContainer = styled.div`
  border-radius: 8px;
  padding: 4px;
  display: flex;
  cursor: pointer;
  max-width: 60%;
  & img,
  .imgPlaceholder {
    border-radius: 50%;
    margin-right: 6px;
    width: 24px;
    height: 24px;
  }
`;
const MessageDefaultContainer = styled(MessageContainer)`
  align-self: flex-start;
  & .imgplaceholder: {
    background: ${({ theme: { text } }) => text};
  }

  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
`;

const MessageSelfContainer = styled(MessageContainer)`
  align-self: flex-end;
  & .imgplaceholder: {
    background: ${({ theme: { background } }) => background};
  }
  background: ${({ theme: { primary } }) => primary};
  color: ${({ theme: { background } }) => background};
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
`;

const MessageItem: FC<MessageType & { isSelfMessage: boolean }> = ({ isSelfMessage, ...messageProps }) => {
  const { by, created, id, value } = messageProps;

  const [user, setUser] = useState<ProfileType>();
  const dispatch = useDispatch();
  useEffect(() => {
    const uploadUser = async () => {
      const profileDoc = doc(db, 'users', by);
      const profileUser = await getDoc(profileDoc);
      setUser(profileUser.data() as ProfileType);
    };
    uploadUser();
  }, []);

  const Container = isSelfMessage ? MessageSelfContainer : MessageDefaultContainer;
  const onClick: MouseEventHandler = ({ currentTarget }) => {
    const { x, y, height, width } = currentTarget.getBoundingClientRect();
    dispatch(toChangeMessageMenuProperties({ messageMenuProperties: { ...messageProps, x, y, isSelfMessage } }));
  };
  return (
    <>
      <Container onClick={onClick}>
        {user ? <img src={user?.photoURL} /> : <div className={'imgPlaceholder'} />} <Text>{value}</Text>
      </Container>
    </>
  );
};

export default MessageItem;
