import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FC } from 'react';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import KickedUserItem from '../../src/components/KickedUserItem';
import Title from '../../src/components/Title';
import { db } from '../../src/layouts/FirebaseLayout';
import { KickedUserType } from '../../src/models/types';

const KickedPage: FC<{ kickedUsersArr: KickedUserType[] }> = ({ kickedUsersArr }) => {
  console.log();
  return (
    <CenteredContainerWithBackButton>
      <KickedUsersContainer>
      {kickedUsersArr.map((props) => {
        return <KickedUserItem {...props} key={props.id}/>
      })}
      </KickedUsersContainer>

    </CenteredContainerWithBackButton>
  );
};

export default KickedPage;

export const getServerSideProps = async () => {
  let kickedUsersArr: KickedUserType[] = [];
  const kickedUsersRef = collection(db, 'kicked');
  const q = query(collection(db, 'posts'), orderBy('when'));

  const kickedUsersSnap = await getDocs(kickedUsersRef);

  kickedUsersSnap.forEach(async doc => {
    kickedUsersArr.push({ ...doc.data(), id: doc.id } as KickedUserType);
  });

  return {
    props: { kickedUsersArr }
  };
};
