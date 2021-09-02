import { colord } from 'colord';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mapValues } from 'lodash';
import styled from 'styled-components';
import IconButton from '../src/components/IconButton';
import { db } from '../src/layouts/FirebaseLayout';
import { device } from '../src/models/denotation';
import { toChangeThemePropertyies, toChangeUser } from '../src/store/modules/App/actions';
import { getThemePropertyies, getUser } from '../src/store/modules/App/selectors';
import Container from '../src/components/Container';
import Title from '../src/components/Title';
import { PostType } from '../src/models/types';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import Button from '../src/components/Button';
import dynamic from 'next/dynamic';
import PostMasonry from '../src/components/PostMasonry';

const MainTitle = dynamic(() => import('../src/components/MainTitle'), { ssr: false });

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

const SignInButton = styled(Button)``;
const HeaderUtilsContainer = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
`;

const UserPhoto = styled.img`
  width: 2.8rem;
  border-radius: 50%;
  height: 2.8rem;
  border: 1px solid ${({ theme: { text } }) => text};
  &:hover {
    cursor: pointer;
    border-color: ${({ theme: { primary } }) => primary};
  }
`;

const Index: FC<{ posts: PostType[] }> = ({ posts }) => {
  const { push } = useRouter();
  const user = useSelector(getUser);
  const isAuth = !!user;

  const theme = useSelector(getThemePropertyies);
  const dispatch = useDispatch();

  const handleChangeTheme = () => {
    const themePropertyies = mapValues(theme, el => colord(el).invert().toHex());
    dispatch(toChangeThemePropertyies({ themePropertyies }));
  };
  const isThemeDark = colord(theme.background).isDark();

  const auth = getAuth();
  onAuthStateChanged(auth, User => {
    dispatch(toChangeUser({ user: User }));
  });

  const handleAuthorisate = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const { user } = await signInWithPopup(auth, provider);
      const { uid, photoURL, displayName, email } = user;

      const f = await setDoc(doc(db, 'users', uid), {
        photoURL,
        displayName,
        email
      });
      toast('Successfully log in!', {
        type: 'success',
        theme: 'colored',
        position: 'bottom-right'
      });
    } catch (error) {
      console.log(error);
      toast('Something went wrong!', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    }
  };

  return (
    <>
      <Container>
        <Title>
          <MainTitle />
          <HeaderUtilsContainer>
            <IconButton
              position={'relative'}
              onClick={handleChangeTheme}
              d={
                isThemeDark
                  ? 'M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zm-2 5.79V18h-3.52L12 20.48 9.52 18H6v-3.52L3.52 12 6 9.52V6h3.52L12 3.52 14.48 6H18v3.52L20.48 12 18 14.48zM12 6.5c-3.03 0-5.5 2.47-5.5 5.5s2.47 5.5 5.5 5.5 5.5-2.47 5.5-5.5-2.47-5.5-5.5-5.5zm0 9c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z'
                  : 'M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zm-2 5.79V18h-3.52L12 20.48 9.52 18H6v-3.52L3.52 12 6 9.52V6h3.52L12 3.52 14.48 6H18v3.52L20.48 12 18 14.48zM12.29 7c-.74 0-1.45.17-2.08.46 1.72.79 2.92 2.53 2.92 4.54s-1.2 3.75-2.92 4.54c.63.29 1.34.46 2.08.46 2.76 0 5-2.24 5-5s-2.24-5-5-5z'
              }
            />
            {!isAuth ? (
              <SignInButton onClick={handleAuthorisate}>Log in</SignInButton>
            ) : (
              <>
                <IconButton
                  onClick={() => signOut(auth)}
                  position={'relative'}
                  d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                />
                <UserPhoto src={user?.photoURL || ''} onClick={() => push(`profile/${user?.uid}`)} />
              </>
            )}
          </HeaderUtilsContainer>
        </Title>
        <PostMasonry posts={posts} isPreviewMode />
      </Container>
      <AddButton
        onClick={() =>
          !isAuth
            ? toast('Only logined users can add posts! Please log in. ', {
                type: 'error',
                theme: 'colored',
                position: 'bottom-right'
              })
            : push('/new')
        }
      >
        +{' '}
      </AddButton>
    </>
  );
};

export default Index;

export const getServerSideProps = async () => {
  const querySnapshot = await getDocs(collection(db, 'posts'));
  const posts: PostType[] = [];
  querySnapshot.forEach(async doc => {
    posts.push({ ...doc.data(), id: doc.id } as PostType);
  });
  return {
    props: { posts: posts.sort(({ created }, __) => __.created - created) }
  };
};
