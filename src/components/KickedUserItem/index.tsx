import { colord } from 'colord';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { FC } from 'react';
import styled from 'styled-components';
import { useFindRankD } from '../../hooks/useFindRankD.hook';
import { useFindUser } from '../../hooks/useFindUser.hook';
import { useRestoreProfile } from '../../hooks/useRestoreProfile.hook';
import { useValidateColor } from '../../hooks/useValidateColor.hook';
import { KickedUserType, RankVariants } from '../../models/types';
import Subtitle from '../Subtitle';

const KickedUserItemContainer = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  & h6 {
    display: flex;
    align-items: center;
  }
  & span {
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  & img {
    margin-right: 4px;
    cursor: pointer;
    border-radius: 50%;
  }
  background: ${({
    theme: { primary, background },
    //@ts-ignore
    isAskedForRestoring,
    color
  }) => (isAskedForRestoring ? color : background)};
  color: ${({
    theme: { text, background },
    //@ts-ignore
    isAskedForRestoring
  }) => (isAskedForRestoring ? background : text)};
  border-bottom: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.16).toHex()};
  & .detailsIconButtonContainer {
    display: flex;
    gap: 8px;
    padding-right: 16px;
    & svg {
      transition: 0.4s ease all;
      border: 1px solid currentcolor;
      display: flex;
      padding: 0.4rem;
      align-items: center;

      &:hover {
        cursor: pointer;
        border-color: ${({
          theme: { text, background },
          //@ts-ignore
          isAskedForRestoring,
          color
        }) => (isAskedForRestoring ? background : text)};
        color: ${({
          theme: { text, background },
          //@ts-ignore
          isAskedForRestoring,
          color
        }) => (isAskedForRestoring ? color : background)};
        background: ${({
          theme: { text, background },
          //@ts-ignore
          isAskedForRestoring,
          color
        }) => (isAskedForRestoring ? background : text)};
      }
      border-radius: 50%;
    }
  }
`;

const KickedUserItem: FC<
  KickedUserType & { handleOpenDetailsDialog?: () => void;userRank?:RankVariants;  isUtilsPartHidden?: boolean }
> = ({ handleOpenDetailsDialog, userRank, isUtilsPartHidden = false, ...props }) => {
  const { by, id, justification, reason, when } = props;
  const isAskedForRestoring = !!justification;

  const kickedUser = useFindUser(id);
  
  const { push } = useRouter();
  const color = useValidateColor(kickedUser?.primaryColor || '');
  return (
    <KickedUserItemContainer
      //@ts-ignore
      isAskedForRestoring={isAskedForRestoring}
      color={color}
    >
      <Subtitle>
        <img src={kickedUser?.photoURL || ''} width={42} height={42} onClick={() => push(`/profile/${id}`)} />
        <svg viewBox={'0 0 24 24'} width={42} height={42} className={'rankSvg'}>
          <path fill={'currentColor'} d={useFindRankD(kickedUser?.rank!)} />
        </svg>
        <span onClick={() => push(`/kicked/${id}`)}>{kickedUser?.displayName}</span>
      </Subtitle>
      {!isUtilsPartHidden && (
        <div className={'detailsIconButtonContainer'}>
          <svg viewBox="0 0 24 24" width={32} height={32} onClick={handleOpenDetailsDialog}>
            <path fill="currentColor" d="M6.38,6H17.63L12,16L6.38,6M3,4L12,20L21,4H3Z" />
          </svg>
          <svg viewBox="0 0 24 24" width={32} height={32} onClick={() => useRestoreProfile(id!, userRank!, push)}>
            <path
              fill="currentColor"
              d={
                'M12,3A9,9 0 0,0 3,12H0L4,16L8,12H5A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19C10.5,19 9.09,18.5 7.94,17.7L6.5,19.14C8.04,20.3 9.94,21 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M14,12A2,2 0 0,0 12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12Z'
              }
            />
          </svg>
        </div>
      )}
    </KickedUserItemContainer>
  );
};

export default KickedUserItem;
