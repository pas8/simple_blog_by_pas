import { colord } from 'colord';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC, MouseEventHandler, useRef } from 'react';
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
import { BlogJsonLd, NextSeo } from 'next-seo';
import { useImgSeo } from '../src/hooks/useImgSeo.hook';

const MainTitle = dynamic(() => import('../src/components/MainTitle'), { ssr: false });
const HeaderMenu = dynamic(() => import('../src/components/HeaderMenu'));

const AddButton = styled.button`
  outline: none;
  border: none;
  box-shadow: 0px 5px 5px -3px ${({ theme: { primary } }) => colord(primary).alpha(0.2).toHex()},
    0px 8px 10px 1px ${({ theme: { primary } }) => colord(primary).alpha(0.14).toHex()},
    0px 3px 14px 2px ${({ theme: { primary } }) => colord(primary).alpha(0.12).toHex()};
  border-radius: 16px;
  height: auto;
  padding: 0.92rem 1.8rem;
  word-break: keep-all;
  cursor: pointer;
  font-size: 1.8em;
  font-weight: 600;
  font-family: monospace;
  position: fixed;
  display: flex;
  align-item: center;
  justify-content: center;
  & svg {
    & path {
      fill: ${({ theme: { background } }) => colord(background).alpha(1).toHex()};
    }
    margin: -2px 8px 0 -8px;
    width: 1.8rem;
  }
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
  border: 1px solid ${({ theme: { background } }) => background};

  color: ${({ theme: { background } }) => background};
  background: ${({ theme: { primary } }) => primary};
  transition: 0.4s ease all;
  &:focus {
    color: ${({ theme: { background } }) => background};
    background: ${({ theme: { primary } }) => primary};
  }
  &:hover {
    border: 1px solid ${({ theme: { primary } }) => primary};

    background: ${({ theme: { primary } }) => colord(primary).darken(0.42).toHex()};
  }
  overflow: hidden;
  & .ripple {
    background: ${({ theme: { background } }) => colord(background).alpha(0.42).toHex()};
    position: absolute;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: animate 1s linear infinite;
  }
  @keyframes animate {
    0% {
      width: 0px;
      height: 0px;
    }
    100% {
      width: 800px;
      height: 800px;
      opacity: 0;
    }
  }
`;

const Index: FC<{ posts: PostType[] }> = ({ posts }) => {
  const { push } = useRouter();
  const user = useSelector(getUser);
  const description =
    'This is a open-source blog platform, where everyone can write blogs, which will publish to the main blog, where everyone can see your post.';

  const rippleRef = useRef({} as HTMLSpanElement);

  const onClickOfAddButton: MouseEventHandler<HTMLButtonElement> = ({ clientX, currentTarget, clientY }) => {
    const x = clientX - currentTarget.offsetLeft;
    const y = clientY - currentTarget.offsetTop;

    rippleRef.current.style.display = 'flex';
    rippleRef.current.style.left = x + 'px';
    rippleRef.current.style.top = y + 'px';

    setTimeout(() => {
      if (!!rippleRef?.current?.style?.display) rippleRef.current.style.display = 'none';
    }, 1000);

    !user
      ? toast('Only logined users can add posts! Please log in. ', {
          type: 'error',
          theme: 'colored',
          position: 'bottom-right'
        })
      : push('/new');
  };

  return (
    <>
      <BlogJsonLd
        dateModified={new Date(posts[0].created).toLocaleString()}
        datePublished={new Date(posts[0].created).toLocaleString()}
        url={'https://simple-blog-by-pas.vercel.app'}
        title={'Simple blog'}
        images={posts.map(({ bg_image }) => bg_image)}
        authorName={'PAS'}
        description={description}
      />

      <NextSeo
        title={'Simple blog'}
        description={description}
        canonical={`https://simple-blog-by-pas.vercel.app`}
        openGraph={{
          url: `https://simple-blog-by-pas.vercel.app`,
          title: 'Simple blog',
          description,
          images: useImgSeo(posts),
          site_name: 'Simple blog'
        }}
      />

      <CommentMenu />
      <Container>
        <Title>
          <MainTitle />
          <HeaderMenu />
        </Title>
        <PostMasonry posts={posts} isPreviewMode />
      </Container>
      <AddButton onClick={onClickOfAddButton}>
        <svg focusable="false" viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z"></path>
        </svg>
        {'Write'}
        <span className={'ripple'} ref={rippleRef} style={{ display: 'none' }}></span>
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
