import { colord } from 'colord';
import { FC, useEffect } from 'react';
import styled from 'styled-components';
import { useFindUser } from '../../../../hooks/useFindUser.hook';
import { CommentType } from '../../../../models/types';
import Text from '../../../Text';

const CommentContainer = styled.div`
  display: flex;
  width: max-content;
  align-items:center;
  border-bottom: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
width:100%;
  padding: 2px;
  & p {
    word-break: break-word;
  }
  & path {
    fill: ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
  }
  &:hover {
    cursor: pointer;
    background: ${({ theme: { background } }) => colord(background).alpha(0.16).toHex()};
  }
  & img {
    margin-left:2px;
    border-radius: 50%;
    margin-right: 8px;
  }
`;

const Comment: FC<CommentType> = ({ id, by, created, isEdited, value }) => {
  const user = useFindUser(by);

  return (
    <CommentContainer>
      <img src={user?.photoURL || ''} width={20} height={20} />
      <Text> {value} </Text>
      {isEdited && (
        <svg viewBox={'0 0 24 24'} width={20} height={20}>
          <path
            d={
              'M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z'
            }
          />
        </svg>
      )}
    </CommentContainer>
  );
};

export default Comment;
