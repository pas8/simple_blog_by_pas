import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/dist/client/router';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileType } from '../../models/types';
import { toChangeUser } from '../../store/modules/App/actions';
import { getThemePropertyies, getUser } from '../../store/modules/App/selectors';
import { db } from '../FirebaseLayout';

const AuthLayout: FC = ({ children }) => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const { pathname } = useRouter();
  const [id, setId] = useState('');
  onAuthStateChanged(auth, user => {
    setId(user?.uid || '');
  });
  const themePropertyies = useSelector(getThemePropertyies);
// console.log( user?.primaryColor )

  useEffect(() => {
    if (!id) return;
    // const s = pathname.startsWith('/profile');
    // const h = pathname.endsWith(id);
    // console.log()
    const handleUploadUser = async () => {
      const profileDoc = doc(db, 'users', id);
      const profileUser = await getDoc(profileDoc);
      dispatch(toChangeUser({ user: { ...profileUser.data(), id} as ProfileType }));
    };

    handleUploadUser();
  }, [id, pathname]);
  return <>{children}</>;
};

export default AuthLayout;

// export const getServerSideProps = async () => {

// console.log(id)

//   return {
//     props: { user: { ...profileUser.data(), id } }
//   };
// };
