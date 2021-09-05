import { doc, getDoc } from 'firebase/firestore';
import { FC } from 'react';
import CenteredContainerWithBackButton from '../../src/components/CenteredContainerWithBackButton';
import KickedUserDetailsContent from '../../src/components/KickedUserDetailsContent';
import SignOutIconButton from '../../src/components/SignOutIconButton';
import Title from '../../src/components/Title';
import { useFindUser } from '../../src/hooks/useFindUser.hook';
import { db } from '../../src/layouts/FirebaseLayout';
import { KickedUserType } from '../../src/models/types';

const KickedPage: FC<{ kickedUser: KickedUserType }> = ({ kickedUser }) => {
  const { by, id, reason, when } = kickedUser;
  const kickedUserData = useFindUser(id);
  return (
    <CenteredContainerWithBackButton>
      <div style={{ position: 'absolute', right:0,top:16}}>
        <SignOutIconButton />
      </div>

      <KickedUserDetailsContent rank={kickedUserData?.rank!} {...kickedUser} />
    </CenteredContainerWithBackButton>
  );
};

export default KickedPage;

export const getServerSideProps = async (ctx: any) => {
  const { id } = ctx.query;
  const kickedUserRef = doc(db, 'kicked', id);
  const docSnap = await getDoc(kickedUserRef);
  return {
    props: { kickedUser: { ...docSnap.data(), id: docSnap.id } as KickedUserType }
  };
};
