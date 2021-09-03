import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HexColorPicker } from 'react-colorful';
import styled from 'styled-components';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import PostMasonry from '../../src/components/PostMasonry';
import Title from '../../src/components/Title';
import { db } from '../../src/layouts/FirebaseLayout';
import { PostType, ProfileDocType, ThemeType } from '../../src/models/types';
import { getThemePropertyies, getUser } from '../../src/store/modules/App/selectors';

import dynamic from 'next/dynamic';
import IconButton from '../../src/components/IconButton';
import Dialog from '../../src/components/Dialog';
import CloseButton from '../../src/components/CloseButton';
import SaveButton from '../../src/components/SaveButton';
import { toChangeThemePropertyies } from '../../src/store/modules/App/actions';
import { colord } from 'colord';
import { toast } from 'react-toastify';

const ProfileContainer = dynamic(() => import('../../src/components/ProfileContainer'), { ssr: false });

const Img = styled.img`
  width: 4rem;
  margin-right: 10px;
  height: 4rem;
  border-radius: 50%;
`;
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const SvgContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 0;
`;
const DialogContentContainer = styled.div`
  & .react-colorful {
    height: 240px;
    width: 280px;
  }
`;

const Profile: FC<{ posts: PostType[]; profileUser: ProfileDocType & { id: string } }> = ({ posts, profileUser }) => {
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const themePropertyies = useSelector(getThemePropertyies);
  const [maintheme, setMainTheme] = useState<ThemeType>(themePropertyies);
  const user = useSelector(getUser);
  useEffect(() => {
    dispatch(
      toChangeThemePropertyies({
        themePropertyies: {
          ...themePropertyies,
          primary:
            colord(themePropertyies.background).isDark() && colord(profileUser.primaryColor).isDark()
              ? colord(profileUser.primaryColor).invert().toHex()
              : profileUser.primaryColor
        }
      })
    );
    return () => {
      dispatch(toChangeThemePropertyies({ themePropertyies: maintheme }));
    };
  }, []);
  const [primary, setPrimary] = useState(themePropertyies.primary);
  const handleCloseThemeDialog = () => setIsThemeDialogOpen(false);
  return (
    <>
      <Dialog
        isOpen={isThemeDialogOpen}
        title={'Change theme color'}
        contentChildren={
          <DialogContentContainer>
            <HexColorPicker color={primary} onChange={setPrimary} />
          </DialogContentContainer>
        }
        utilsChildren={
          <>
            <CloseButton onClick={handleCloseThemeDialog} />
            <SaveButton
              onClick={async () => {
                if (!user?.id) return;
                const ref = doc(db, 'users', user?.id);
                try {
                  await updateDoc(ref, {
                    primaryColor: primary
                  });
                  toast('You changed theme color, reload page, to see changes', {
                    type: 'info',
                    theme: 'colored',
                    position: 'bottom-right'
                  });

                } catch (error) {
                  console.log(error);
                  toast('Something went wrong', { type: 'error', theme: 'colored', position: 'bottom-right' });
                }

                handleCloseThemeDialog();
              }}
            />
          </>
        }
      />

      <CenteredContainerWithBackButton>
        {user?.id === profileUser.id && (
          <SvgContainer>
            <IconButton
              onClick={() => setIsThemeDialogOpen(true)}
              position={'relative'}
              d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67 0 1.38-1.12 2.5-2.5 2.5zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5 0-.16-.08-.28-.14-.35-.41-.46-.63-1.05-.63-1.65 0-1.38 1.12-2.5 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"
            />
          </SvgContainer>
        )}
        <ProfileContainer>
          <Title>
            <TitleWrapper>
              {<Img src={profileUser.photoURL || ''} />}${profileUser?.displayName || profileUser?.email}
            </TitleWrapper>
          </Title>
        </ProfileContainer>
        <PostMasonry posts={posts} />
      </CenteredContainerWithBackButton>
    </>
  );
};

export default Profile;

export const getServerSideProps = async (context: any) => {
  const { id } = context.query;

  const profileDoc = doc(db, 'users', id);
  const profileUser = await getDoc(profileDoc);

  const posts: PostType[] = [];
  const q = query(collection(db, 'posts'), where('maintainer', '==', id));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async doc => {
    posts.push({ ...doc.data(), id: doc.id } as PostType);
  });
  return {
    props: {
      posts: posts.sort(({ created }, __) => __.created - created),
      profileUser: { ...profileUser.data(), id: profileUser.id }
    }
  };
};
