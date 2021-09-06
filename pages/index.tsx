import { colord } from 'colord';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC, useEffect } from 'react';
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
import { PostType, RankVariants } from '../src/models/types';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import Button from '../src/components/Button';
import dynamic from 'next/dynamic';
import PostMasonry from '../src/components/PostMasonry';
import UserPhoto from '../src/components/UserPhoto';
import CommentMenu from '../src/components/CommentMenu';
import SignOutIconButton from '../src/components/SignOutIconButton';

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

const Index: FC<{ posts: PostType[] }> = ({ posts }) => {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  const isAuth = !!user;

  const theme = useSelector(getThemePropertyies);

  const handleChangeTheme = async () => {
    if (!user) return;
    const isThemeDark = !colord(theme.background).isDark();

    try {
      const ref = doc(db, 'users', user.id);

      await updateDoc(ref, {
        isThemeDark
      });
      dispatch(
        toChangeThemePropertyies({
          themePropertyies: { ...mapValues(theme, el => colord(el).invert().toHex()), primary: theme.primary }
        })
      );
    } catch (error) {
      console.log(error);
      toast('Something went wrong, try again ', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    }
  };

  const auth = getAuth();

  const handleAuthorisate = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      const { uid, photoURL, displayName, email } = user;
      const docRef = doc(db, 'users', uid);

      const docSnap = await getDoc(docRef);

      try {
        if (!docSnap.exists()) {
          const f = await setDoc(doc(db, 'users', uid), {
            photoURL,
            gitHubURL: '',
            websiteURL: '',
            rank: RankVariants.HASTATI,
            crowns: [],
            description: '',
            isThemeDark: true,
            primaryColor: '#FFEA00',
            displayName,
            email
          });
        }
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
    } catch (error) {
      console.log(error);
      toast('Something went wrong!', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    }
  };
  const isThemeDark = colord(theme.background).isDark();

  return (
    <>
      <CommentMenu />
      <Container>
        <Title>
          <MainTitle />
          <HeaderUtilsContainer>
            {!isAuth ? (
              <SignInButton onClick={handleAuthorisate}>Log in</SignInButton>
            ) : (
              <>
                <IconButton
                  position={'relative'}
                  onClick={handleChangeTheme}
                  d={
                    isThemeDark
                      ? 'M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zm-2 5.79V18h-3.52L12 20.48 9.52 18H6v-3.52L3.52 12 6 9.52V6h3.52L12 3.52 14.48 6H18v3.52L20.48 12 18 14.48zM12 6.5c-3.03 0-5.5 2.47-5.5 5.5s2.47 5.5 5.5 5.5 5.5-2.47 5.5-5.5-2.47-5.5-5.5-5.5zm0 9c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z'
                      : 'M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zm-2 5.79V18h-3.52L12 20.48 9.52 18H6v-3.52L3.52 12 6 9.52V6h3.52L12 3.52 14.48 6H18v3.52L20.48 12 18 14.48zM12.29 7c-.74 0-1.45.17-2.08.46 1.72.79 2.92 2.53 2.92 4.54s-1.2 3.75-2.92 4.54c.63.29 1.34.46 2.08.46 2.76 0 5-2.24 5-5s-2.24-5-5-5z'
                  }
                />
                <IconButton
                  position={'relative'}
                  onClick={() => push('/kicked')}
                  d={
                    'M19,1.27C18.04,0.72 16.82,1.04 16.27,2C15.71,2.95 16.04,4.18 17,4.73C17.95,5.28 19.17,4.96 19.73,4C20.28,3.04 19.95,1.82 19,1.27M21.27,9.34L18.7,13.79L16.96,12.79L18.69,9.79L17.14,8.5L14,13.92V22H12V13.39L2.47,7.89L3.47,6.16L11.27,10.66L13.67,6.5L7.28,4.17L8,2.29L14.73,4.74L15,4.84C15.39,5 15.76,5.15 16.12,5.35L16.96,5.84C17.31,6.04 17.65,6.28 17.96,6.54L18.19,6.74L21.27,9.34Z'
                  }
                />
                <IconButton
                  position={'relative'}
                  onClick={() => push(`/fired/${user?.id}`)}
                  d={
                    'M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z'
                  }
                />

                <IconButton
                  position={'relative'}
                  onClick={() => push('/users')}
                  d={
                    'M10,13C9.65,13.59 9.36,14.24 9.19,14.93C6.5,15.16 3.9,16.42 3.9,17V18.1H9.2C9.37,18.78 9.65,19.42 10,20H2V17C2,14.34 7.33,13 10,13M10,4A4,4 0 0,1 14,8C14,8.91 13.69,9.75 13.18,10.43C12.32,10.75 11.55,11.26 10.91,11.9L10,12A4,4 0 0,1 6,8A4,4 0 0,1 10,4M10,5.9A2.1,2.1 0 0,0 7.9,8A2.1,2.1 0 0,0 10,10.1A2.1,2.1 0 0,0 12.1,8A2.1,2.1 0 0,0 10,5.9M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14Z'
                  }
                />

                <IconButton
                  onClick={() => {
                    push(`/chat/${user?.id}`);
                  }}
                  position={'relative'}
                  d="M20 17.17L18.83 16H4V4h16v13.17zM20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z"
                />

                <SignOutIconButton />
                <UserPhoto src={user?.photoURL || ''} onClick={() => push(`/profile/${user?.id}`)} />
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
