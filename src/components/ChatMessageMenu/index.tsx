import { colord } from 'colord';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getMessageMenuProperties } from '../../store/modules/App/selectors';
import MessageItem from '../MessageItem';
import Text from '../Text';

const ChatMessageMenuContainer = styled.div`
  position: absolute;
  // width: 320px;
  padding: 8px;
  border-radius: 8px;
  background: ${({ theme: { background } }) => background};
  z-index: 10;
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
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

const ChatMessageMenu: FC = () => {
  const messageMenuProperties = useSelector(getMessageMenuProperties);
  console.log(messageMenuProperties);
  if (!messageMenuProperties) return <></>;
  const { x, y, ...messageProps } = messageMenuProperties;

  const menuUtilsArr = [
    {
      d: 'M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z',
      onClick: () => {},
      caption: 'Delete'
    },
    {
      d: 'M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z',
      onClick: () => {},
      caption: 'Copy'
    },

    

  ];

  return (
    <ChatMessageMenuContainer style={{ top: y, left: x  }}>
      <MessageItem {...messageProps} />
      <UtilsContainer>
        {menuUtilsArr.map(({ d, caption, onClick }) => {
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
