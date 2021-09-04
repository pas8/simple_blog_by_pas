import { colord } from 'colord';
import { useRouter } from 'next/dist/client/router';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useFindUser } from '../../hooks/useFindUser.hook';
import { db } from '../../layouts/FirebaseLayout';
import { ChatMessageMenuPropsType } from '../../models/types';
import { toChangeMessageMenuProperties } from '../../store/modules/App/actions';
import { getMessageMenuProperties } from '../../store/modules/App/selectors';
import SearchLabel from '../CreatingPostPart/components/SearchLabel';
import TextArea from '../CreatingPostPart/components/TextArea';
import Text from '../Text';

const ChatMessageMenuContainer = styled.div`
  position: absolute;
  width: min-content;
  padding: 8px;
  & .searchLabelContainer {
    &:hover {
      background: ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
      cursor: pointer;
    }
    width: 93%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 6px;
  }
  border-radius: 8px;
  background: ${({ theme: { background } }) => background};
  z-index: 10;
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
  & > div {
    max-width: 100%;
  }
`;

const MenuItemContainer = styled.div`
  color: ${({ theme: { text } }) => text};
  display: flex;
  padding: 6px;
  & svg {
    margin-right: 6px;
    width: 24px;
  }
  &:hover {
    background: ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
    cursor: pointer;
  }
  border-bottom: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
`;

const UtilsContainer = styled.div`
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};

  overflow: hidden;
`;
const DateContainer = styled(UtilsContainer)`
  padding: 4px 8px;
  margin-top: 2px;
  white-space: nowrap;
`;

const MessgePreviewContainer = styled.div`
  position: relative;

  & textarea {
    margin: 0;
    width: calc(100% - 10%);
  }
`;

const ChatMessageMenu: FC<ChatMessageMenuPropsType> = ({
  handleDeleteMessage,
  handleUpdateMessage,
  isPrivateMode = false
}) => {
  const messageMenuProperties = useSelector(getMessageMenuProperties);
  const [messageValue, setMessageValue] = useState(messageMenuProperties?.value || '');
  const dispatch = useDispatch();
  const { push } = useRouter();
  const handleCloseMenu = () => dispatch(toChangeMessageMenuProperties({ messageMenuProperties: null }));

  useEffect(() => {
    setMessageValue(messageMenuProperties?.value || '');
    return () => {
      setMessageValue('');
    };
  }, [messageMenuProperties?.value]);

  if (!messageMenuProperties) return <></>;
  const { x, y, ...messageProps } = messageMenuProperties;
  const notPrivateUtils = isPrivateMode && !messageMenuProperties.isSelfMessage ? ['Save', 'Delete'] : !messageMenuProperties.isSelfMessage ? ['Save'] : [];
  const menuUtilsArr = [
    {
      d: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
      onClick: handleCloseMenu,
      caption: 'Close'
    },
    {
      d: 'M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z',
      onClick: async () => {
        handleDeleteMessage(messageMenuProperties.id);
        handleCloseMenu();
      },
      caption: 'Delete'
    },
    {
      d: 'M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z',
      onClick: () => {
        navigator.clipboard
          .writeText(messageValue)
          .then(() => {
            toast('Text was copied ', {
              type: 'success',
              theme: 'colored',
              position: 'bottom-right'
            });
          })
          .catch(err => {
            console.log(err);
            toast('Something went wrong ', {
              type: 'error',
              theme: 'colored',
              position: 'bottom-right'
            });
          });
      },
      caption: 'Copy'
    },

    {
      d: 'M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z',
      onClick: async () => {
        if (!messageMenuProperties.isSelfMessage)
          return toast('U can not edit somebody message! ', {
            type: 'warning',
            theme: 'colored',
            position: 'bottom-right'
          });
        handleUpdateMessage(messageMenuProperties.id, messageValue);
        handleCloseMenu();
      },
      caption: 'Save'
    }
  ];

  return (
    <ChatMessageMenuContainer style={{ top: y, left: x }}>
      <span
        onClick={() => {
          handleCloseMenu();

          push(`/profile/${messageMenuProperties?.by}`);
        }}
      >
        <SearchLabel id={messageMenuProperties?.by || ''} />
      </span>

      <MessgePreviewContainer>
        <TextArea
          value={messageValue}
          onChange={({ target: { value } }) =>
            setMessageValue(!messageMenuProperties.isSelfMessage ? messageValue : value)
          }
          autoFocus
          minRows={1}
          maxRows={42}
        />{' '}
      </MessgePreviewContainer>
      <DateContainer>{new Date(messageProps?.created).toLocaleString()}</DateContainer>
      <UtilsContainer>
        {menuUtilsArr
          .filter(({ caption }) => !notPrivateUtils.includes(caption))
          .map(({ d, caption, onClick }) => {
            return (
              <MenuItemContainer key={d} onClick={onClick}>
                <svg viewBox={'0 0 24 24'}>
                  <path d={d} fill={'currentcolor'} />
                </svg>
                <Text>{caption}</Text>
              </MenuItemContainer>
            );
          })}
      </UtilsContainer>
    </ChatMessageMenuContainer>
  );
};

export default ChatMessageMenu;
