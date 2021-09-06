import { colord } from 'colord';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { db } from '../src/layouts/FirebaseLayout';
import { device } from '../src/models/denotation';
import { getUser } from '../src/store/modules/App/selectors';
import Container from '../src/components/Container';
import Title from '../src/components/Title';
import { PostType } from '../src/models/types';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import PostMasonry from '../src/components/PostMasonry';
import CommentMenu from '../src/components/CommentMenu';

const MainTitle = dynamic(() => import('../src/components/MainTitle'), { ssr: false });
const HeaderMenu = dynamic(() => import('../src/components/HeaderMenu'));

const AddButton = styled.button`
  outline: none;
  border: none;
  box-shadow: 0px 5px 5px -3px ${({ theme: { primary } }) => colord(primary).alpha(0.2).toHex()},
    0px 8px 10px 1px ${({ theme: { primary } }) => colord(primary).alpha(0.14).toHex()},
    0px 3px 14px 2px ${({ theme: { primary } }) => colord(primary).alpha(0.12).toHex()};
  border-radius: 50%;
  width: 5.6rem;
  cursor: pointer;
  font-size: 2.8em;
  height: 5.6rem;
  position: fixed;
  bottom: 1.4rem;

  @media ${device.desktop} {
    right: 19.2vw;
  }
  @media ${device.laptopL} {
    right: 12vw;
  }
  @media ${device.laptop} {
    right: 9.2vw;
  }
  @media ${device.tablet} {
    right: 4.6vw;
  }
  @media ${device.mobileM} {
    right: 2vw;
  }

  border: 1px solid ${({ theme: { primary } }) => primary};
  color: ${({ theme: { primary } }) => primary};
  background: ${({ theme: { background } }) => background};
  transition: 0.4s ease all;
  &:focus {
    color: ${({ theme: { background } }) => background};
    background: ${({ theme: { primary } }) => primary};
  }
  &:hover {
    color: ${({ theme: { background } }) => background};
    background: ${({ theme: { primary } }) => primary};
  }
`;

const Index: FC<{ posts: PostType[] }> = ({ posts }) => {
  const { push } = useRouter();
  const user = useSelector(getUser);

  return (
    <>
      <CommentMenu />
      <Container>
        <Title>
          <MainTitle />
          <HeaderMenu />
        </Title>
        <PostMasonry posts={posts} isPreviewMode />
      </Container>
      <AddButton
        onClick={() =>
          !user
            ? toast('Only logined users can add posts! Please log in. ', {
                type: 'error',
                theme: 'colored',
                position: 'bottom-right'
              })
            : push('/new')
        }
      >
        {'+'}
      </AddButton>
    </>
  );
};

export default Index;

export const getServerSideProps = async () => {
  let kickedUsersArr: string[] = [];
  const kickedUsersRef = collection(db, 'kicked');
  const kickedUsersSnap = await getDocs(kickedUsersRef);

  kickedUsersSnap.forEach(async doc => {
    kickedUsersArr.push(doc.id);
  });
  const q = query(
    collection(db, 'posts'),
    where('maintainer', 'not-in', !!kickedUsersArr.length ? kickedUsersArr : [{ maintainer: '' }])
  );

  const querySnapshot = await getDocs(q);

  const posts: PostType[] = [];
  querySnapshot.forEach(async doc => {
    posts.push({ ...doc.data(), id: doc.id } as PostType);
  });
  return {
    props: { posts: posts.sort(({ created }, __) => __.created - created) }
  };
};
