import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { db } from '../../layouts/FirebaseLayout';
import { toChangeCommentMenuProperties } from '../../store/modules/App/actions';
import { getCommentMenuProperties, getUser } from '../../store/modules/App/selectors';
import ChatMessageMenuContainer from '../ChatMessageMenu/components/ChatMessageMenuContainer';
import DateContainer from '../ChatMessageMenu/components/DateContainer';
import MenuItemContainer from '../ChatMessageMenu/components/MenuItemContainer';
import MessgePreviewContainer from '../ChatMessageMenu/components/MessgePreviewContainer';
import UtilsContainer from '../ChatMessageMenu/components/UtilsContainer';
import SearchLabel from '../CreatingPostPart/components/SearchLabel';
import TextArea from '../CreatingPostPart/components/TextArea';
import Text from '../Text';

const CommentMenu: FC = ({}) => {
  const commentMenuProperties = useSelector(getCommentMenuProperties);
  const [commentValue, setCommentValue] = useState(commentMenuProperties?.value || '');
  const dispatch = useDispatch();
  const { push } = useRouter();
  const handleCloseMenu = () => dispatch(toChangeCommentMenuProperties({ commentMenuProperties: null }));
  const user = useSelector(getUser);
  useEffect(() => {
    setCommentValue(commentMenuProperties?.value || '');
    return () => {
      setCommentValue('');
    };
  }, [commentMenuProperties?.value]);

  if (!commentMenuProperties) return <></>;
  const { x, y, postId } = commentMenuProperties;
  const notPrivateUtils =
    user?.id !== commentMenuProperties.by ? ['Save', 'Delete'] : !commentMenuProperties.isSelfComment ? ['Save'] : [];

  const docRef = doc(db, `posts/${postId}/comments`, commentMenuProperties.id);

  const menuUtilsArr = [
    {
      d: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
      onClick: handleCloseMenu,
      caption: 'Close'
    },
    {
      d: 'M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z',
      onClick: async () => {
        try {
          await deleteDoc(docRef);
          toast('Comment, was deleted  ', {
            type: 'info',
            theme: 'colored',
            position: 'bottom-right'
          });
        } catch (error) {
          console.log(error);
          toast('Something went wrong, try again ', {
            type: 'error',
            theme: 'colored',
            position: 'bottom-right'
          });
        }
        handleCloseMenu();
      },
      caption: 'Delete'
    },
    {
      d: 'M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z',
      onClick: () => {
        navigator.clipboard
          .writeText(commentValue)
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
        try {
          await updateDoc(docRef, { value: commentValue, isEdited: true });
          toast('Comment, was deleted  ', {
            type: 'info',
            theme: 'colored',
            position: 'bottom-right'
          });
        } catch (error) {
          console.log(error);
          toast('Something went wrong, try again ', {
            type: 'error',
            theme: 'colored',
            position: 'bottom-right'
          });
        }

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

          push(`/profile/${commentMenuProperties?.by}`);
        }}
      >
        <SearchLabel id={commentMenuProperties?.by || ''} />
      </span>

      <MessgePreviewContainer>
        <TextArea
          value={commentValue}
          onChange={({ target: { value } }) =>
            setCommentValue(!commentMenuProperties.isSelfComment ? commentValue : value)
          }
          autoFocus={commentMenuProperties.isSelfComment}
          minRows={1}
          maxRows={42}
        />{' '}
      </MessgePreviewContainer>
      <DateContainer>{new Date(commentMenuProperties?.created).toLocaleString()}</DateContainer>
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

export default CommentMenu;
