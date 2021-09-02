import { colord } from 'colord';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { FC, Fragment, useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Text from '../Text';
import { db } from '../../layouts/FirebaseLayout';
import { PostType } from '../../models/types';
import { useRouter } from 'next/dist/client/router';
import { useSelector } from 'react-redux';
import Link from 'next/link';

import { getUser } from '../../store/modules/App/selectors';
import Caption from '../Caption';

const PostContainer = styled.div`
  border-radius: 8px;
  padding:0.42em;
  & .editIconButton{
    display:none;
  }
  border:1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()}};
  & .commentContainer{
    position:relative;
    margin-top:8px;
    & .iconButtonWhichAddingNewComment{
      position:absolute;
      bottom:0px;
      height:20px;
      border-radius:50%;
      padding:4px;
      border:2px solid transparent;
      background: ${({ theme: { background } }) => background};

      &:hover{
        cursor:pointer;
        border-color: ${({ theme: { background } }) => background}
      }
      right:0px;
      width:20px;
    }
    & textarea {
      background:transparent;
      outline:none;
      border-radius: 8px;
      resize: none;
      width:100%;
      border:none;
    }}
    & textarea, a {
      color: ${({ theme: { text } }) => text};


    };
    &:hover{
      & a {

      color: ${({ theme: { background } }) => background};
        
      }
      & .editIconButton{
        display:block;
      }
      & .commentContainer{
      & .iconButtonWhichAddingNewComment{ background: ${({ theme: { primary } }) => primary};}
      & textarea {
      color: ${({ theme: { background } }) => background};
    }}
    & .dateContainer{
      background: ${({ theme: { primary } }) => primary};
      color: ${({ theme: { background } }) => background};
    };
    background: ${({ theme: { primary } }) => primary};
    color: ${({ theme: { background } }) => background};
    border-color: ${({ theme: { primary } }) => primary};
  }
`;
const PostTitle = styled.h4`
  font-size: 2.42rem;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 0 0;
  user-select: none;
  & a {
    text-decoration: none;
  }
  & a:hover {
    text-decoration: underline;
  }
  & .editIconButton {
    position: absolute;
    width: 1.6rem;
    bottom: 0.42rem;
    right: 0;
    border: 1px solid transparent;
    border-radius: 50%;
    padding: 4px;
 
    &:hover {
    cursor: pointer;

      border-color: ${({ theme: { background } }) => background};
    }
  }
  }
`;

const PostUtilsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 8px 0;

  & p {
    text-overflow: ellipsis;
    max-width: 58%;
    overflow: hidden;
  }
  & svg {
    cursor: pointer;
    width: 24px;
  }
`;

const Img = styled.img`
  width: 100%;
  margin-top: 10px;
  border-radius: 8px;
`;

const CommentContainer = styled.ul`
  margin-block-start: 0em;
  margin-block-end: 0.32em;
  padding-inline-start: 22px;
  list-style-type: '$   ';
  & li {
    margin-bottom: 4px;
    font-size: 0.8rem;
  }
`;
const TextPost = styled(Text)`
  margin: 10px 0;
`;
const DateContainer = styled(Caption)`
  padding: 4px 6px;
  left: 4px;

  border-radius: 8px;
  border-top-left-radius: 0;
  border-bottom-right-radius: 0;
  z-index: 10;
  background: ${({ theme: { background } }) => colord(background).alpha(0.58).toHex()};
  color: ${({ theme: { text } }) => text};
  position: absolute;
  bottom: 8px;
`;
const ImgContainer = styled.div`
  position: relative;
  cursor: pointer;
`;
const TextLink = styled(Text)`
  &:hover {
    cursor: pointer;
    color: ${({ theme: { background } }) => background};
    text-decoration: underline;
  }
`;

const Post: FC<PostType & { isPreviewMode?: boolean }> = ({
  Title: title,
  Text: text,
  created,
  id,
  bg_image,
  by,
  likes = [],
  comments = [],
  isPreviewMode = false
}) => {
  const { push } = useRouter();
  const user = useSelector(getUser);
  const isAuth = !!user;
  const [state, setState] = useState({
    commentValue: '',
    isWritingComment: false,
    isLiked: likes.includes(user?.uid || '')
  });

  useEffect(() => {
    setState(state => ({ ...state, isLiked: likes.includes(user?.uid || '') }));
  }, [likes, user]);

  const handleChangeLikedStatus = async () => {
    const ref = doc(db, 'posts', id);
    await updateDoc(ref, {
      likes: likes?.includes(user?.uid || '') ? likes.filter(id => user?.uid !== id) : [...likes, user?.uid]
    });
    setState(state => ({ ...state, isLiked: !state.isLiked }));
  };

  const handleChangeCommendedStatus = () => {
    setState(state => ({ ...state, isWritingComment: !state.isWritingComment }));
  };

  const handleAddComment = async () => {
    if (!state.commentValue)
      return toast('U should write something at first)', {
        type: 'warning',
        theme: 'colored',
        position: 'bottom-right'
      });
    const ref = doc(db, 'posts', id);
    try {
      await updateDoc(ref, {
        comments: [...comments, { by: user?.uid, value: state.commentValue, name: user?.displayName || user?.email }]
      });
      toast('U successfully added a comment)', {
        type: 'success',
        theme: 'colored',
        position: 'bottom-right'
      });
    } catch (error) {
      toast('Something  went wront!', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    }
    setState(state => ({ ...state, isWritingComment: false, commentValue: '' }));
  };
  return (
    <PostContainer key={`${title}_${text}_${created}`}>
      <PostTitle>
        <Link href={`/post/${id}`}>
          <a> {title} </a>
        </Link>
        {/* {user?.uid === by.id && ( */}
        <svg viewBox="0 0 24 24" className={'editIconButton'} onClick={() => push(`/edit/${id}`)}>
          <path
            fill={'currentcolor'}
            d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
          ></path>
        </svg>
        {/* )} */}
      </PostTitle>
      <ImgContainer onDoubleClick={handleChangeLikedStatus}>
        <Img src={bg_image} />
        <DateContainer className={'dateContainer'}> {new Date(created).toLocaleString()}</DateContainer>
      </ImgContainer>
      <TextPost>{isPreviewMode && text.length > 292 ? `${text.slice(0,292)}...` : text}</TextPost>
      <PostUtilsContainer>
        {[
          {
            value: state.isLiked,
            number: likes.length,

            onClick: handleChangeLikedStatus,
            d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
          },
          {
            value: state.isWritingComment,
            number: comments.length,
            onClick: handleChangeCommendedStatus,
            d: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z'
          }
        ].map(({ value, d, onClick, number }) => (
          <Fragment key={d}>
            <span style={{ marginRight: -6 }}>{number}</span>
            <svg
              viewBox={'0 0 24 24'}
              onClick={() =>
                !isAuth
                  ? toast('Only logined users can comment or like  posts! Please log in. ', {
                      type: 'error',
                      theme: 'colored',
                      position: 'bottom-right'
                    })
                  : onClick()
              }
            >
              <path d={d} fill={value ? 'currentcolor' : 'none'} stroke={'currentcolor'} strokeWidth={2} />
            </svg>
          </Fragment>
        ))}
        <TextLink onClick={() => push(`/profile/${by.id}`)}> {`$_${by.name}`} </TextLink>
      </PostUtilsContainer>
      <CommentContainer>
        {comments.map(({ name, value }) => {
          return <li key={name}>{`${name}    |   ${value}`}</li>;
        })}
      </CommentContainer>
      {state.isWritingComment && (
        <div className={'commentContainer'}>
          <TextareaAutosize
            maxRows={16}
            autoFocus
            onChange={({ target: { value: commentValue } }) => setState(state => ({ ...state, commentValue }))}
            value={state.commentValue}
            placeholder={'Comment'}
          />
          <svg onClick={handleAddComment} className={'iconButtonWhichAddingNewComment'} viewBox={'0 0 24 24'}>
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill={'currentcolor'} />
          </svg>
        </div>
      )}
    </PostContainer>
  );
};

export default Post;
