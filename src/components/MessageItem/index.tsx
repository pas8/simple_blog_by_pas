import { colord } from 'colord';
import { doc, getDoc } from 'firebase/firestore';
import { FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useFindUser } from '../../hooks/useFindUser.hook';
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
  align-items: center;
  & .imgPlaceholder {
    background: ${({ theme: { primary } }) => primary};
    border: 1px solid ${({ theme: { background } }) => background};
  }
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
  & path {
    fill: ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
  }
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
`;

const MessageSelfContainer = styled(MessageContainer)`
  align-self: flex-end;
  & path {
    fill: ${({ theme: { background } }) => colord(background).alpha(0.42).toHex()};
  }
  background: ${({ theme: { primary } }) => primary};

  color: ${({ theme: { background } }) => background};
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
`;

const MessageItem: FC<MessageType & { isSelfMessage: boolean }> = ({ isSelfMessage, ...messageProps }) => {
  const { by, created, id, value, isEdited } = messageProps;

  const user = useFindUser(by);
  const dispatch = useDispatch();

  const Container = isSelfMessage ? MessageSelfContainer : MessageDefaultContainer;
  const onClick: MouseEventHandler = ({ currentTarget }) => {
    const { x, y, height, width } = currentTarget.getBoundingClientRect();
    dispatch(toChangeMessageMenuProperties({ messageMenuProperties: { ...messageProps, x, y, isSelfMessage } }));
  };
  return (
    <>
      <Container onClick={onClick}>
        {user ? <img src={user?.photoURL} /> : <div className={'imgPlaceholder'} />} <Text>{value}</Text>{' '}
        {isEdited && (
          <svg viewBox={'0 0 24 24'} width={20} height={20}>
            <path
              d={
                'M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z'
              }
            />
          </svg>
        )}
      </Container>
    </>
  );
};

export default MessageItem;
