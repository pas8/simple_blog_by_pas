import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { ChangeEventHandler, FC, MouseEventHandler, MutableRefObject, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HexColorPicker } from 'react-colorful';
import styled from 'styled-components';

import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import PostMasonry from '../../src/components/PostMasonry';
import Title from '../../src/components/Title';
import { db } from '../../src/layouts/FirebaseLayout';
import { PostType, ProfileDocType, ThemeType } from '../../src/models/types';
import { getThemePropertyies, getUser } from '../../src/store/modules/App/selectors';

import IconButton from '../../src/components/IconButton';
import Dialog from '../../src/components/Dialog';
import CloseButton from '../../src/components/CloseButton';
import SaveButton from '../../src/components/SaveButton';
import { toChangeThemePropertyies } from '../../src/store/modules/App/actions';
import { colord } from 'colord';
import { toast } from 'react-toastify';
import Subtitle from '../../src/components/Subtitle';

import dynamic from 'next/dynamic';
import Text from '../../src/components/Text';
import TextArea from '../../src/components/CreatingPostPart/components/TextArea';
import Input from '../../src/components/Input';
import { capitalize } from 'lodash';
import Link from 'next/link';
import Button from '../../src/components/Button';

const ProfileContainer = dynamic(() => import('../../src/components/ProfileContainer'), { ssr: false });

const Img = styled.img`
  width: 4rem;
  margin-right: 10px;
  height: 4rem;
  border-radius: 50%;
`;
const TitleWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
`;
const SvgContainer = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  gap: 8px;
  top: 16px;
`;
const DialogContentContainer = styled.div`
  & .react-colorful {
    height: 240px;
    width: 280px;
  }
`;
const DescriptionTextArea = styled(TextArea)`
  padding: 10px 8px;
  width: 320px;
`;

const ProfilePropertiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  & .title {
    margin-top: -10px;
    & img {
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  & a {
    margin-left: 6px;
    color: ${({ theme: { text } }) => text};
  }
  & h6,
  p {
    display: flex;
    align-items: center;
  }
  & input {
    // font-size: 1.16rem;
  }
  & input,
  textarea {
    margin: 0;
    width: 320px;
  }
`;

const CrownPreviewContainer = styled.div`
  border-radius: 8px;
  background: ${({ theme: { background } }) => background};
  color: ${({
    theme: { text, primary },
    //@ts-ignore
    isCrownWasGiven
  }) => (isCrownWasGiven ? primary : text)};
  font-size: 1rem;
  border: 1px solid;
  &:hover {
    border-color:${({
      theme: { text, primary },
      //@ts-ignore
      isCrownWasGiven
    }) => (isCrownWasGiven ? primary : text)};
    color: ${({ theme: { background } }) => background};
    background: ${({
      theme: { text, primary },
      //@ts-ignore
      isCrownWasGiven
    }) => (isCrownWasGiven ? primary : text)};
    cursor: pointer;
  }
  display: flex;
  top: 4px;
  left: 42px;
  position: absolute;
  align-items: center;
`;
const Profile: FC<{ posts: PostType[]; profileUser: ProfileDocType & { id: string } }> = ({ posts, profileUser }) => {
  const { description, gitHubURL, websiteURL } = profileUser;
  const dispatch = useDispatch();

  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [isProfilePropertyiesDialogOpen, setIsProfilePropertyiesDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [crowns, setCrowns] = useState(profileUser?.crowns || []);

  const themePropertyies = useSelector(getThemePropertyies);
  const [maintheme, setMainTheme] = useState<ThemeType>(themePropertyies);

  const user = useSelector(getUser);
  const { push } = useRouter();

  const nulittyState = { description, gitHubURL, websiteURL };
  const [state, setState] = useState(nulittyState);
  const [primary, setPrimary] = useState(themePropertyies.primary);

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
  const isSelfPage = user?.id === profileUser.id;

  const handleCloseThemeDialog = () => setIsThemeDialogOpen(false);
  const handleCloseProfilePropertyiesDialog = () => setIsProfilePropertyiesDialogOpen(false);
  const handleCloseDetailsDialog = () => setIsDetailsDialogOpen(false);

  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = ({ target: { value, name } }) => {
    setState(state => ({ ...state, [name]: value }));
  };
  const stateNames = { DESCRIPTION: 'description', GIT_HUB_URL: 'gitHubURL', WEBSITE_URL: 'websiteURL' } as const;
  const isCrownWasGiven = crowns.includes(user?.id || '');

  const handleChangeCrowns = async () => {
    if (!user?.id)
      return toast('U dont have access for that, please sign in! ', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    try {
      const ref = doc(db, 'users', profileUser.id);
      const c = isCrownWasGiven ? crowns.filter(id => id !== user?.id) : [...crowns, user?.id];
      await updateDoc(ref, {
        crowns: c
      });
      setCrowns(c);
    } catch (error) {
      console.log(error);
      toast('Something went wrong, try again ', {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    }
  };

  return (
    <>
      <Dialog
        isOpen={isThemeDialogOpen}
        title={'Change theme color'}
        contentChildren={<DialogContentContainer></DialogContentContainer>}
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

      <Dialog
        isOpen={isProfilePropertyiesDialogOpen}
        title={'Set up your profile'}
        contentChildren={
          <DialogContentContainer>
            <ProfilePropertiesContainer>
              <DescriptionTextArea
                onChange={onChange}
                placeholder={capitalize(stateNames.DESCRIPTION)}
                value={state[stateNames.DESCRIPTION]}
                name={stateNames.DESCRIPTION}
              />
              <Input
                onChange={onChange}
                placeholder={capitalize(stateNames.WEBSITE_URL)}
                value={state[stateNames.WEBSITE_URL]}
                name={stateNames.WEBSITE_URL}
              />
              <Input
                onChange={onChange}
                placeholder={capitalize(stateNames.GIT_HUB_URL)}
                value={state[stateNames.GIT_HUB_URL]}
                name={stateNames.GIT_HUB_URL}
              />
            </ProfilePropertiesContainer>
          </DialogContentContainer>
        }
        utilsChildren={
          <>
            <CloseButton onClick={handleCloseProfilePropertyiesDialog} />
            <SaveButton
              onClick={async () => {
                if (!user?.id) return;
                const ref = doc(db, 'users', user?.id);
                try {
                  await updateDoc(ref, {
                    ...state
                  });
                  toast('You changed propertyies of your profile, reload page, to see changes', {
                    type: 'info',
                    theme: 'colored',
                    position: 'bottom-right'
                  });
                } catch (error) {
                  console.log(error);
                  toast('Something went wrong', { type: 'error', theme: 'colored', position: 'bottom-right' });
                }

                handleCloseProfilePropertyiesDialog();
              }}
            />
          </>
        }
      />

      <Dialog
        isOpen={isDetailsDialogOpen}
        title={''}
        contentChildren={
          <DialogContentContainer>
            <ProfilePropertiesContainer>
              <Subtitle className={'title'}>
                <img src={profileUser.photoURL || ''} width={48} height={48} />${profileUser.displayName}
              </Subtitle>
              {
                <Button onClick={handleChangeCrowns}>
                  <svg viewBox="0 0 24 24" width={42} height={42}>
                    <path
                      fill="currentColor"
                      d={
                        isCrownWasGiven
                          ? 'M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z'
                          : 'M12 8L15 13.2L18 10.5L17.3 14H6.7L6 10.5L9 13.2L12 8M12 4L8.5 10L3 5L5 16H19L21 5L15.5 10L12 4M19 18H5V19C5 19.6 5.4 20 6 20H18C18.6 20 19 19.6 19 19V18Z'
                      }
                    />
                  </svg>
                  {isCrownWasGiven ? 'Deprive crown' : 'Give crown'}
                </Button>
              }
              {websiteURL && (
                <Subtitle>
                  <svg viewBox="0 0 24 24" height={42} width={42}>
                    <path
                      fill="currentColor"
                      d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                    />
                  </svg>

                  <Link href={websiteURL}> Web site </Link>
                </Subtitle>
              )}
              {/* `${crowns.length} Crowns` */}
              {gitHubURL && (
                <Subtitle>
                  <svg viewBox="0 0 24 24" height={42} width={42}>
                    <path
                      fill="currentColor"
                      d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                    />
                  </svg>
                  <Link href={gitHubURL}> Git Hub </Link>
                </Subtitle>
              )}
              <Text>{description}</Text>
            </ProfilePropertiesContainer>
          </DialogContentContainer>
        }
        utilsChildren={
          <>
            <CloseButton onClick={handleCloseDetailsDialog} />
          </>
        }
      />

      <CenteredContainerWithBackButton>
        <SvgContainer>
          <IconButton
            onClick={() => (isSelfPage ? setIsProfilePropertyiesDialogOpen(true) : setIsDetailsDialogOpen(true))}
            position={'relative'}
            d={
              isSelfPage
                ? 'M2 17V20H10V18.11H3.9V17C3.9 16.36 7.03 14.9 10 14.9C10.96 14.91 11.91 15.04 12.83 15.28L14.35 13.76C12.95 13.29 11.5 13.03 10 13C7.33 13 2 14.33 2 17M10 4C7.79 4 6 5.79 6 8S7.79 12 10 12 14 10.21 14 8 12.21 4 10 4M10 10C8.9 10 8 9.11 8 8S8.9 6 10 6 12 6.9 12 8 11.11 10 10 10M21.7 13.35L20.7 14.35L18.65 12.35L19.65 11.35C19.86 11.14 20.21 11.14 20.42 11.35L21.7 12.63C21.91 12.84 21.91 13.19 21.7 13.4M12 18.94L18.06 12.88L20.11 14.88L14.11 20.95H12V18.94'
                : 'M6.38,6H17.63L12,16L6.38,6M3,4L12,20L21,4H3Z'
            }
          />
          {!!user?.id && (
            <IconButton
              onClick={() =>
                isSelfPage ? setIsThemeDialogOpen(true) : push(`/messages/${user?.id}/${profileUser.id}`)
              }
              position={'relative'}
              d={
                isSelfPage
                  ? 'M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67 0 1.38-1.12 2.5-2.5 2.5zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5 0-.16-.08-.28-.14-.35-.41-.46-.63-1.05-.63-1.65 0-1.38 1.12-2.5 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z'
                  : 'M20 17.17L18.83 16H4V4h16v13.17zM20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z'
              }
            />
          )}
        </SvgContainer>
        <ProfileContainer>
          <Title>
            <TitleWrapper>
              {<Img src={profileUser.photoURL || ''} />}${profileUser?.displayName || profileUser?.email}
              {
                //@ts-ignore
                <CrownPreviewContainer isCrownWasGiven={isCrownWasGiven} onClick={handleChangeCrowns}>
                  {crowns.length}

                  <svg viewBox="0 0 24 24" width={22} height={22}>
                    <path
                      fill="currentColor"
                      d={
                        isCrownWasGiven
                          ? 'M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z'
                          : 'M12 8L15 13.2L18 10.5L17.3 14H6.7L6 10.5L9 13.2L12 8M12 4L8.5 10L3 5L5 16H19L21 5L15.5 10L12 4M19 18H5V19C5 19.6 5.4 20 6 20H18C18.6 20 19 19.6 19 19V18Z'
                      }
                    />
                  </svg>
                </CrownPreviewContainer>
              }
            </TitleWrapper>
          </Title>
        </ProfileContainer>

        {!!posts.length ? (
          <PostMasonry posts={posts} isPreviewMode />
        ) : (
          <Subtitle>No posts was created by this user :(</Subtitle>
        )}
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
