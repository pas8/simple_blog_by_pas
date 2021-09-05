import { colord } from 'colord';
import { doc, getDoc } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useFindRankD } from '../../../../hooks/useFindRankD.hook';
import { db } from '../../../../layouts/FirebaseLayout';
import { ProfileDocType } from '../../../../models/types';

const SearchLabelContainer = styled.div`
  border-radius: 8px;
  display: flex;
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
  padding: 4px;
  word-break: break-word;
  align-items: center;
  & img {
    border-radius: 50%;
    margin-right: 8px;
  }
`;

const SearchLabel: FC<{ id: string; maxNameLength?: number }> = ({ id, maxNameLength = 0 }) => {
  const [userProfileData, setUserProfileData] = useState<ProfileDocType>();
  useEffect(() => {
    const handleSetProfileData = async () => {
      const profileDoc = doc(db, 'users', id);
      const profileUser = await getDoc(profileDoc);
      setUserProfileData(profileUser.data() as ProfileDocType);
    };
    handleSetProfileData();
  }, [id]);
  if (!userProfileData) return <></>;
  const d = useFindRankD(userProfileData.rank);

  return (
    <SearchLabelContainer className={'searchLabelContainer'}>
      <img src={userProfileData?.photoURL || ''} width={24} height={24} />
      <svg viewBox="0 0 24 24" width={22} height={22}>
        <path fill="currentColor" d={d} />
      </svg>
      {`${
        userProfileData?.displayName.length > maxNameLength && !!maxNameLength
          ? userProfileData?.displayName.slice(0, maxNameLength) + '...'
          : userProfileData?.displayName || ''
      }` || 'No name'}
    </SearchLabelContainer>
  );
};

export default SearchLabel;
