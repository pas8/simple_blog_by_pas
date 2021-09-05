import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ProfileType } from '../../models/types';
import { toChangeUser } from '../../store/modules/App/actions';
import { db } from '../FirebaseLayout';

const AuthLayout: FC = ({ children }) => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const { pathname, push } = useRouter();
  const [id, setId] = useState('');
  onAuthStateChanged(auth, user => {
    setId(user?.uid || '');
  });

  useEffect(() => {
    if (!id) return;
    const defenderForKickedUsers = async () => {
      const kickedUserRef = doc(db, 'kicked', id);
      const kickedUserSnap = await getDoc(kickedUserRef);
      if (kickedUserSnap.exists()) {
        toast(`U was kicked `, {
          type: 'info',
          theme: 'colored',
          position: 'bottom-right'
        });
        push(`/kicked/${id}`);
        return;
      }
    };

    defenderForKickedUsers();
    const handleUploadUser = async () => {
      const profileDoc = doc(db, 'users', id);
      const profileUser = await getDoc(profileDoc);
      dispatch(toChangeUser({ user: { ...profileUser.data(), id } as ProfileType }));
    };

    handleUploadUser();
  }, [id, pathname]);
  return <>{children}</>;
};

export default AuthLayout;
