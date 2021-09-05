import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { capitalize } from 'lodash';
import { useRouter } from 'next/dist/client/router';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useFindRankD } from '../../hooks/useFindRankD.hook';
import { useRestoreProfile } from '../../hooks/useRestoreProfile.hook';
import { db } from '../../layouts/FirebaseLayout';
import { KickedUserType, RankVariants } from '../../models/types';
import { getUser } from '../../store/modules/App/selectors';
import Button from '../Button';
import SearchLabel from '../CreatingPostPart/components/SearchLabel';
import TextArea from '../CreatingPostPart/components/TextArea';
import FlexContainerWithBorder from '../FlexContainerWithBorder';
import KickedUserItem from '../KickedUserItem';
import SaveButton from '../SaveButton';
import Subtitle from '../Subtitle';

const DialogContentContainer = styled.div`
  width: 100%;
  overflow: hidden;
  margin-top: -12px;

  & .rankSvg {
    margin-right: 4px;
  }
  & .titleContainer {
    overflow: hidden;
    border-radius: 8px;
  }
  & .contentContainer {
    padding: 8px;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
    & textarea {
      margin: 0px;
    }
    & > div {
      padding: 4px 8px;
      width: fit-content;
    }
    & .reasonContainer {
      padding: 4px 8px;
      max-width: 320px;
    }
    & .whenContainer {
    }
    & .searchLabelContainer {
      &:hover {
      }
    }
  }
`;
const KickedUserDetailsContent: FC<KickedUserType & { rank: RankVariants }> = dialogProps => {
  const user = useSelector(getUser);
  const [justification, setJustification] = useState(dialogProps.justification);
  const { push } = useRouter();
  return (
    <DialogContentContainer>
      <FlexContainerWithBorder className={'titleContainer'}>
        <KickedUserItem {...dialogProps} isUtilsPartHidden />
      </FlexContainerWithBorder>

      <FlexContainerWithBorder className={'contentContainer'}>
        <Subtitle>Kicked by:</Subtitle>

        <SearchLabel id={dialogProps?.by || ''} />
        <Subtitle>When:</Subtitle>

        <FlexContainerWithBorder className={'whenContainer'}>
          {new Date(dialogProps?.when).toLocaleString()}
        </FlexContainerWithBorder>
        <Subtitle>Reason:</Subtitle>

        <FlexContainerWithBorder className={'reasonContainer'}>{dialogProps.reason}</FlexContainerWithBorder>
      </FlexContainerWithBorder>
      <FlexContainerWithBorder className={'contentContainer'}>
        <Subtitle>Rank:</Subtitle>
        <FlexContainerWithBorder>
          <svg viewBox={'0 0 24 24'} width={24} height={24} className={'rankSvg'}>
            <path fill={'currentColor'} d={useFindRankD(dialogProps?.rank!)} />
          </svg>
          {capitalize(dialogProps?.rank)}
        </FlexContainerWithBorder>
        {(user?.id === dialogProps.id || !!justification) && <Subtitle>Justification:</Subtitle>}
        {user?.id === dialogProps.id ? (
          <>
            <TextArea
              onChange={({ target: { value } }) => setJustification(value)}
              value={justification}
              placeholder={'Write something...'}
            />
            <SaveButton
              onClick={async () => {
                const kickedUserRef = doc(db, 'kicked', user?.id);
                try {
                  await updateDoc(kickedUserRef, { justification });
                  toast('Your justification message was updated!', {
                    type: 'info',
                    theme: 'colored',
                    position: 'bottom-right'
                  });
                } catch (error) {
                  console.log(error);
                  toast('Something went wrong, try again ', {
                    type: 'error',
                    theme: 'colored',
                    position: 'bottom-right'
                  });
                }
              }}
            />
          </>
        ) : !justification ? null : (
          <>
            <FlexContainerWithBorder>{justification}</FlexContainerWithBorder>
            <Button onClick={() => useRestoreProfile(dialogProps.id!, user?.rank!, push)}>
              <svg viewBox="0 0 24 24" width={24} height={24}>
                <path
                  fill="currentColor"
                  d="M12,3A9,9 0 0,0 3,12H0L4,16L8,12H5A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19C10.5,19 9.09,18.5 7.94,17.7L6.5,19.14C8.04,20.3 9.94,21 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M14,12A2,2 0 0,0 12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12Z"
                />
              </svg>
              Restore
            </Button>
          </>
        )}
      </FlexContainerWithBorder>
      {/* {user?.id === dialogProps.id && ( */}

      {/* )} */}
    </DialogContentContainer>
  );
};

export default KickedUserDetailsContent;
