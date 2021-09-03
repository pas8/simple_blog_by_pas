import { colord } from 'colord';
import { doc, getDoc } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../../../../layouts/FirebaseLayout';
import { ProfileDocType } from '../../../../models/types';

const SearchLabelContainer = styled.div`
  border-radius: 8px;
  display: flex;
  border: 1px solid ${({ theme: { text } }) => colord(text).alpha(0.42).toHex()};
  width: max-content;
  padding: 4px;
  & img {
    border-radius: 50%;
    margin-right: 8px;
  }
`;

const SearchLabel: FC<{ id: string }> = ({ id }) => {
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

  return (
    <SearchLabelContainer className={'searchLabelContainer'}>
      <img src={userProfileData?.photoURL || ''} width={24} height={24} />
      {`$${userProfileData?.displayName}` || userProfileData?.email}{' '}
    </SearchLabelContainer>
  );
};

export default SearchLabel;
