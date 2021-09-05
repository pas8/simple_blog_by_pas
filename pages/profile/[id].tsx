import { collection, query, where, getDocs, getDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { ChangeEventHandler, FC, ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HexColorPicker } from 'react-colorful';
import styled from 'styled-components';

import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import PostMasonry from '../../src/components/PostMasonry';
import Title from '../../src/components/Title';
import { db } from '../../src/layouts/FirebaseLayout';
import { PostType, ProfileDocType, RankVariants } from '../../src/models/types';
import { getThemePropertyies, getUser } from '../../src/store/modules/App/selectors';

import IconButton from '../../src/components/IconButton';
import Dialog from '../../src/components/Dialog';
import CloseButton from '../../src/components/CloseButton';
import SaveButton from '../../src/components/SaveButton';
import { toast } from 'react-toastify';
import Subtitle from '../../src/components/Subtitle';

import dynamic from 'next/dynamic';
import Text from '../../src/components/Text';
import TextArea from '../../src/components/CreatingPostPart/components/TextArea';
import Input from '../../src/components/Input';
import { capitalize } from 'lodash';
import Link from 'next/link';
import Button from '../../src/components/Button';
import CommentMenu from '../../src/components/CommentMenu';
import { useFindRankD } from '../../src/hooks/useFindRankD.hook';
import RankSystem from '../../src/components/RankSystem';
import { useUploadUsersTheme } from '../../src/hooks/useUploadUsersTheme.hook';
import { colord } from 'colord';

const ProfileContainer = dynamic(() => import('../../src/components/ProfileContainer'), { ssr: false });

const ImgContainer = styled.div`
  margin-right: 8px;
  display: flex;
  align-itens: center;
  position: relative;
  & img {
    width: 4rem;
    margin-right: 10px;
    height: 4rem;
    border-radius: 50%;
  }
`;
const TitleWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  & .rankSvg {
    &:hover {
      cursor: pointer;
      & path {
        fill: ${({ theme: { primary } }) => primary};
      }
    }
  }
`;
const SvgContainer = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  gap: 8px;
  top: 16px;
`;
const DialogContentContainer = styled.div`
  width: 100%;
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
    border-color: ${({
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
  top: -4px;
  right: -4px;
  position: absolute;
  align-items: center;
`;

const DescriptionGitHubWebSiteContainer = styled.div`
  border: 1px solid;
  border-color: ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
  border-radius: 8px;
  & p {
    padding: 8px;
    & svg {
      border-radius: 50%;
      margin-right: 12px;

      border: 1px solid ${({ theme: { text } }) => text};
      width: 32px;
      padding: 2px;
      height: 32px;
    }
  }
  & h6 {
    &:hover {
      text-decoration: underline;
      background: ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
    }
    & svg {
      margin-right: 8px;
    }
    padding: 6px;

    position: relative;
    & a {
      position: absolute;
      inset: 0;
    }
    border-bottom: 1px solid;
    border-color: ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
  }
  flex-direction: column;
  display: flex;
`;

const Profile: FC<{ posts: PostType[]; profileUser: ProfileDocType & { id: string } }> = ({ posts, profileUser }) => {
  const { description, gitHubURL, websiteURL } = profileUser;
  enum ContentChildrenNameVariants {
    KICK = 'kick'
  }

  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [isProfilePropertyiesDialogOpen, setIsProfilePropertyiesDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isRankDialogOpen, setIsRankDialogOpen] = useState(false);

  const nullityOfDefenderDialogState = {
    isOpen: false,
    title: '',
    submitButtonText: '',
    onSubmit: () => {},
    contentChildrenName: '' as ContentChildrenNameVariants
  };
  const [valueWhyUserShouldBeKicked, setValueWhyUserShouldBeKicked] = useState('');
  const [defenderDialogState, setDefenderDialogState] = useState(nullityOfDefenderDialogState);

  const [crowns, setCrowns] = useState(profileUser?.crowns || []);

  const themePropertyies = useSelector(getThemePropertyies);

  const user = useSelector(getUser);
  const { push } = useRouter();

  const nulittyState = { description, gitHubURL, websiteURL };
  const [state, setState] = useState(nulittyState);
  const [primary, setPrimary] = useState(themePropertyies.primary);

  useUploadUsersTheme(profileUser);

  const isSelfPage = user?.id === profileUser.id;

  const handleCloseThemeDialog = () => setIsThemeDialogOpen(false);
  const handleCloseProfilePropertyiesDialog = () => setIsProfilePropertyiesDialogOpen(false);
  const handleCloseDetailsDialog = () => setIsDetailsDialogOpen(false);
  const handleCloseRankDialog = () => setIsRankDialogOpen(false);
  const handleCloseDefenderDialog = () => setDefenderDialogState(nullityOfDefenderDialogState);
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

  const [currentRank, setCurrentRank] = useState(profileUser.rank);
  const d = useFindRankD(currentRank);

  const handleKickUser = async () => {
    if (profileUser.rank === RankVariants.TRIARII && user?.rank !== RankVariants.IMPERATOR) {
      return toast(`Only ${RankVariants.IMPERATOR}  can kick ${RankVariants.TRIARII}  `, {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    } else if (user?.rank === RankVariants.IMPERATOR || user?.rank === RankVariants.TRIARII) {
      setValueWhyUserShouldBeKicked(state => {
        if (state.length < 42) {
          toast('Please write reason for kick ', {
            type: 'error',
            theme: 'colored',
            position: 'bottom-right'
          });
          return '';
        } else {
          const docRef = doc(db, 'kicked', profileUser.id);
          console.log(state.length);
          setDoc(docRef, {
            when: Date.now(),
            by: user?.id,
            reason: state,
            isAskedForRestoring: false
          })
            .then(res => {
              toast('User was kicked :) ', {
                type: 'warning',
                theme: 'colored',
                position: 'bottom-right'
              });
            })
            .catch(error => {
              console.log(error);
              toast('Something went wrong, try again ', {
                type: 'error',
                theme: 'colored',
                position: 'bottom-right'
              });
            });
          handleCloseDefenderDialog();
          return state;
        }
      });
    } else {
      return toast(`Only ${RankVariants.IMPERATOR} or ${RankVariants.TRIARII} can kick users  `, {
        type: 'error',
        theme: 'colored',
        position: 'bottom-right'
      });
    }
  };
  return (
    <>
      <CommentMenu />
      <Dialog
        plusZIndex={2}
        isOpen={defenderDialogState.isOpen}
        title={defenderDialogState.title}
        contentChildren={
          <>
            {defenderDialogState.contentChildrenName === 'kick' && (
              <DialogContentContainer>
                <TextArea
                  style={{ margin: 0 }}
                  value={valueWhyUserShouldBeKicked}
                  maxRows={16}
                  onChange={({ target: { value } }) => setValueWhyUserShouldBeKicked(value)}
                  placeholder={'Please, tell why u want kick this user!'}
                />
              </DialogContentContainer>
            )}
          </>
        }
        utilsChildren={
          <>
            <Button onClick={handleCloseDefenderDialog}>Cancel</Button>
            {
              //@ts-ignore
              <Button isDangerous onClick={defenderDialogState.onSubmit}>
                {defenderDialogState.submitButtonText}
              </Button>
            }
          </>
        }
      />

      <Dialog
        isOpen={isRankDialogOpen}
        title={'Rank system'}
        plusZIndex={1}
        contentChildren={
          <DialogContentContainer>
            <RankSystem
              currentRank={currentRank}
              setCurrentRank={setCurrentRank}
              userPhotoURL={profileUser.photoURL}
              isSelfPage={isSelfPage}
            />
          </DialogContentContainer>
        }
        utilsChildren={
          <>
            <CloseButton onClick={handleCloseRankDialog} />
            <SaveButton
              onClick={async () => {
                //@ts-ignore
                const rankArr = Object.values(RankVariants).reverse();
                const rankIdx = rankArr.findIndex(el => el === profileUser.rank);
                if (!user?.rank)
                  return toast('You dont have accesss for than, please sign in!(  ', {
                    type: 'error',
                    theme: 'colored',
                    position: 'bottom-right'
                  });
                if (rankArr.findIndex(el => el === user?.rank) >= rankIdx)
                  return toast('Your rank is the same or lower than this user :(  ', {
                    type: 'error',
                    theme: 'colored',
                    position: 'bottom-right'
                  });

                const docRef = doc(db, 'users', profileUser.id);
                try {
                  await updateDoc(docRef, {
                    rank: currentRank
                  });
                } catch (error) {
                  console.log(error);
                  setCurrentRank(profileUser.rank);
                  toast('Something wents wrong:()  ', {
                    type: 'error',
                    theme: 'colored',
                    position: 'bottom-right'
                  });
                }

                handleCloseRankDialog();
              }}
            />
          </>
        }
      />

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
                if (state.description.length > 420)
                  return toast('Max description length is 420 symbols', {
                    type: 'error',
                    theme: 'colored',
                    position: 'bottom-right'
                  });

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
                <img src={profileUser.photoURL || ''} width={48} height={48} />
                {profileUser.displayName}
              </Subtitle>
              <DescriptionGitHubWebSiteContainer>
                {websiteURL && (
                  <Subtitle>
                    <svg viewBox="0 0 24 24" height={42} width={42}>
                      <path
                        fill="currentColor"
                        d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                      />
                    </svg>
                    Web site
                    <Link href={websiteURL}> </Link>
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
                    Git Hub
                    <Link href={gitHubURL}> </Link>
                  </Subtitle>
                )}
                {description && (
                  <Text>
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M13.5,4A1.5,1.5 0 0,0 12,5.5A1.5,1.5 0 0,0 13.5,7A1.5,1.5 0 0,0 15,5.5A1.5,1.5 0 0,0 13.5,4M13.14,8.77C11.95,8.87 8.7,11.46 8.7,11.46C8.5,11.61 8.56,11.6 8.72,11.88C8.88,12.15 8.86,12.17 9.05,12.04C9.25,11.91 9.58,11.7 10.13,11.36C12.25,10 10.47,13.14 9.56,18.43C9.2,21.05 11.56,19.7 12.17,19.3C12.77,18.91 14.38,17.8 14.54,17.69C14.76,17.54 14.6,17.42 14.43,17.17C14.31,17 14.19,17.12 14.19,17.12C13.54,17.55 12.35,18.45 12.19,17.88C12,17.31 13.22,13.4 13.89,10.71C14,10.07 14.3,8.67 13.14,8.77Z"
                      />
                    </svg>
                    {description}
                  </Text>
                )}
              </DescriptionGitHubWebSiteContainer>

              {
                <Button onClick={() => setIsRankDialogOpen(true)}>
                  <svg viewBox="0 0 24 24" width={42} height={42}>
                    <path fill="currentColor" d={d} />
                  </svg>
                  {capitalize(currentRank)} Rank
                </Button>
              }

              {
                //@ts-ignore
                <Button onClick={handleChangeCrowns} isDefault={isCrownWasGiven}>
                  <svg viewBox="0 0 24 24" width={42} height={42}>
                    <path
                      fill="currentColor"
                      d={
                        'M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z'
                      }
                    />
                  </svg>
                  {isCrownWasGiven ? 'Deprive fire' : 'Give fire'}
                </Button>
              }

              {
                <Button
                  onClick={() =>
                    setDefenderDialogState({
                      isOpen: true,
                      onSubmit: handleKickUser,
                      contentChildrenName: ContentChildrenNameVariants.KICK,
                      submitButtonText: 'Kick',
                      title: 'Are u sure that you want kick this user?'
                    })
                  }
                  //@ts-ignore
                  isDangerous
                >
                  <svg viewBox="0 0 24 24" width={42} height={42}>
                    <path
                      fill="currentColor"
                      d={
                        'M19,1.27C18.04,0.72 16.82,1.04 16.27,2C15.71,2.95 16.04,4.18 17,4.73C17.95,5.28 19.17,4.96 19.73,4C20.28,3.04 19.95,1.82 19,1.27M21.27,9.34L18.7,13.79L16.96,12.79L18.69,9.79L17.14,8.5L14,13.92V22H12V13.39L2.47,7.89L3.47,6.16L11.27,10.66L13.67,6.5L7.28,4.17L8,2.29L14.73,4.74L15,4.84C15.39,5 15.76,5.15 16.12,5.35L16.96,5.84C17.31,6.04 17.65,6.28 17.96,6.54L18.19,6.74L21.27,9.34Z'
                      }
                    />
                  </svg>
                  {'Kick user'}
                </Button>
              }
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
              <ImgContainer>
                {
                  //@ts-ignore
                  <CrownPreviewContainer isCrownWasGiven={isCrownWasGiven} onClick={handleChangeCrowns}>
                    {crowns.length}

                    <svg viewBox="0 0 24 24" width={22} height={22}>
                      <path
                        fill={'currentColor'}
                        d={
                          'M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z'
                        }
                      />
                    </svg>
                  </CrownPreviewContainer>
                }
                <img src={profileUser.photoURL || ''} />
              </ImgContainer>
              <svg
                viewBox={'0 0 24 24'}
                width={60}
                height={60}
                className={'rankSvg'}
                onClick={() => setIsRankDialogOpen(true)}
              >
                <path fill={'currentColor'} d={d} />
              </svg>
              {profileUser?.displayName || profileUser?.email}
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
