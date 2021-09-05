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
  const themePropertyies = useSelector(getThemePropertyies);
  // console.log(user)
  // useEffect(() => {
  // dispatch(toChangeThemePropertyies({ themePropertyies: { ...themePropertyies, primary: user?.primaryColor } }));
  // }, [user?.primaryColor]);

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
  };
  const isThemeDark = colord(theme.background).isDark();

  return (
    <>
      <CommentMenu />
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
            <IconButton
              position={'relative'}
              onClick={() => push('/kicked')}
              d={
                'M19,1.27C18.04,0.72 16.82,1.04 16.27,2C15.71,2.95 16.04,4.18 17,4.73C17.95,5.28 19.17,4.96 19.73,4C20.28,3.04 19.95,1.82 19,1.27M21.27,9.34L18.7,13.79L16.96,12.79L18.69,9.79L17.14,8.5L14,13.92V22H12V13.39L2.47,7.89L3.47,6.16L11.27,10.66L13.67,6.5L7.28,4.17L8,2.29L14.73,4.74L15,4.84C15.39,5 15.76,5.15 16.12,5.35L16.96,5.84C17.31,6.04 17.65,6.28 17.96,6.54L18.19,6.74L21.27,9.34Z'
              }
            />
            {!isAuth ? (
              <SignInButton onClick={handleAuthorisate}>Log in</SignInButton>
            ) : (
              <>
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
  const q = query(collection(db, 'posts'), where('maintainer', 'not-in',  !!kickedUsersArr.length ? kickedUsersArr : [{maintainer:''}]));

  const querySnapshot = await getDocs(q);

  const posts: PostType[] = [];
  querySnapshot.forEach(async doc => {
    posts.push({ ...doc.data(), id: doc.id } as PostType);
  });
  return {
    props: { posts: posts.sort(({ created }, __) => __.created - created) }
  };
};
