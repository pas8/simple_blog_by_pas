import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ProfileType } from '../../models/types';
import { toChangeUser } from '../../store/modules/App/actions';
import { db } from '../FirebaseLayout';

const AuthLayout: FC = ({ children }) => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const [id, setId] = useState('');
  onAuthStateChanged(auth, user => {
    setId(user?.uid || '');
  });

  useEffect(() => {
    if (!id) return;
    const handleUploadUser = async () => {
      const profileDoc = doc(db, 'users', id);
      const profileUser = await getDoc(profileDoc);
      dispatch(toChangeUser({ user: { ...profileUser.data(), id } as ProfileType }));
    };
    handleUploadUser();
  }, [id]);
  return <>{children}</>;
};

export default AuthLayout;

// export const getServerSideProps = async () => {

// console.log(id)

//   return {
//     props: { user: { ...profileUser.data(), id } }
//   };
// };
